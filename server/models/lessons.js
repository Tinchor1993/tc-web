import { isLogicalEmpty } from '../utils'
import normalizeEmpty from "../helpers/normalizeEmpty";

const uuidV4 = require('uuid/v4')
const moment = require('moment')

export default ({ config, db }) => ({
  getAll(size, id, creationDate, status) {
    const params = {
      TableName: config.tables.lessons,
      IndexName: 'status-creationDate-index',
      KeyConditions: {
        status: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['OK']
        },
        creationDate: {
          ComparisonOperator: 'BETWEEN',
          AttributeValueList: [0, 9999999999999999999]
        }
      },
      Limit: size,
      ExclusiveStartKey: {
        id: '',
        creationDate: '',
        status: ''
      },
      ScanIndexForward: false
    }

    if (id) {
      params.ExclusiveStartKey.id = id
      params.ExclusiveStartKey.creationDate = Number.parseInt(creationDate, 10)
      params.ExclusiveStartKey.status = status
    } else {
      delete params.ExclusiveStartKey
    }

    return db
      .query(params)
      .promise()
      .then(data => data.Items)
  },

  getById(id) {
    let params = {
      TableName: config.tables.lessons,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': id
      }
    }

    return db
      .query(params)
      .promise()
      .then(data => {
        const lesson = data.Items[0]

        if (!lesson) {
          throw Error('Lesson not found')
        }

        return lesson
      })
      .then(async lesson => {
        const lessonId = lesson.id

        const [presentation, questions] = await Promise.all([
          this._getPresentationByLessonId(lessonId),
          this._getQuizQuestionsByLessonId(lessonId)
        ])

        lesson.presentation = presentation
        lesson.quiz = {
          layout: questions[0] && questions[0].layout,
          backgroundMusic: questions[0] && questions[0].backgroundMusic,
          questions: questions
        }

        return lesson
      })
  },
  _getPresentationByLessonId(lessonId) {
    let params = {
      TableName: config.tables.presentations,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'lessonId'
      },
      ExpressionAttributeValues: {
        ':idd': lessonId
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => {
        console.info(`_getPresentationByLessonId(${lessonId})`)
        console.log(data.Items)
        console.log('end')
        return data.Items[0]
      })
  },

  _getQuizQuestionsByLessonId(lessonId) {
    let params = {
      TableName: config.tables.quiz,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'lessonId'
      },
      ExpressionAttributeValues: {
        ':idd': lessonId
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => data.Items)
      .then((questions = []) => {
        return Promise.all(
          questions.map(async question => {
            const questionId = question.id
            question.answers = await this._getQuestionAnswers(questionId)
            return question
          })
        )
      })
  },

  _getQuestionAnswers(quizId) {
    let params = {
      TableName: config.tables.answers,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'quizId'
      },
      ExpressionAttributeValues: {
        ':idd': quizId
      },
      IndexName: 'status-creationDate-index',
      KeyConditions: {
        status: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['OK']
        },
        creationDate: {
          ComparisonOperator: 'BETWEEN',
          AttributeValueList: [0, 9999999999999999999]
        }
      },

      ScanIndexForward: false
    }

    return db
      .scan(params)
      .promise()
      .then(data => data.Items)
  },

  _createPresentation(lessonId, presentation) {
    console.dir(presentation.slides)

    const params = {
      TableName: config.tables.presentations,
      Item: {
        id: uuidV4(),
        slides: normalizeEmpty(presentation.slides, []),
        backgroundMusic: {
          src: presentation.backgroundMusic.src || 'null',
          repeat: presentation.backgroundMusic.repeat || false,
          on: presentation.backgroundMusic.on || false,
          delay: presentation.backgroundMusic.delay || 0,
          loud: presentation.backgroundMusic.loud || 0
        },
        creationDate: moment().unix(),
        lessonId
      }
    }

    return db.put(params).promise()
  },

  _deleteAnswer(answer) {
    let params = {
      TableName: config.tables.answers,
      Key: {
        id: answer.id.toString(),
        creationDate: answer.creationDate
      }
    }

    return db.delete(params).promise()
  },

  _createAnswer(quizId, item) {
    const params = {
      TableName: config.tables.answers,
      Item: {
        id: uuidV4(),
        quizId,
        isCorrect: item.isCorrect || false,
        text: item.text || 'null',
        element: item.element || 'null',
        type: item.type || 'text',
        media: item.media || 'null',
        status: 'OK',
        creationDate: moment().unix()
      }
    }

    return db.put(params).promise()
  },

  _createAnswers(questionId, answers) {
    return Promise.all(answers.map(answer => this._createAnswer(questionId, answer)))
  },

  _createQuestion(lessonId, question) {
    let id = uuidV4()
    const { answers = [] } = question

    const params = {
      TableName: config.tables.quiz,
      Item: {
        id,
        lessonId,
        text: question.text || 'null',
        layout: question.layout || 'list',
        showDescription: question.showDescription || false,
        backgroundMusic: {
          src: question.backgroundMusic.src || 'null',
          repeat: question.backgroundMusic.repeat || false,
          on: question.backgroundMusic.on || false,
          delay: question.backgroundMusic.delay || 0,
          loud: question.backgroundMusic.loud || 0
        }
      }
    }

    return db
      .put(params)
      .promise()
      .then(() => this._createAnswers(id, answers))
  },

  _updateAnswer(data) {
    const { id, creationDate } = data

    let params = {
      TableName: config.tables.answers,
      Key: {
        id: id.toString(),
        creationDate: Number(creationDate)
      },
      UpdateExpression: `
        set isCorrect = :isCorrect,
        #quest = :text,
        #elem = :element,
        #typer = :type,
        media = :media
      `,
      ExpressionAttributeNames: {
        '#quest': 'text',
        '#elem': 'element',
        '#typer': 'type'
      },
      ExpressionAttributeValues: {
        ':isCorrect': data.isCorrect || false,
        ':text': data.text || 'empty',
        ':element': data.element || 'null',
        ':type': data.type,
        ':media': data.media || 'null'
      },
      ReturnValues: 'UPDATED_NEW'
    }

    return db.update(params).promise()
  },

  _updateAnswers(quizId, answers = []) {
    return Promise.all(
      answers.map(answer => {
        if (!isLogicalEmpty(answer.isDeleted)) return this._deleteAnswer(answer)

        return answer.id ? this._updateAnswer(answer) : this._createAnswer(quizId, answer)
      })
    )
  },

  _deleteQuestion(question) {
    let params = {
      TableName: config.tables.quiz,
      Key: {
        id: question.id.toString(),
        creationDate: question.creationDate
      }
    }

    return db.delete(params).promise()
  },

  _updateQuestion(data) {
    const params = {
      TableName: config.tables.quiz,
      Key: {
        id: data.id.toString()
      },
      UpdateExpression:
        'set #quest = :quest, #layo = :layout, backgroundMusic = :backgroundMusic, showDescription=:showDescription',
      ExpressionAttributeNames: {
        '#quest': 'text',
        '#layo': 'layout'
      },
      ExpressionAttributeValues: {
        ':showDescription': data.showDescription || false,
        ':quest': data.text || 'null',
        ':layout': data.layout || 'list',
        ':backgroundMusic': data.backgroundMusic || 'null'
      }
    }

    return db
      .update(params)
      .promise()
      .then(() => this._updateAnswers(data.id, data.answers))
  },

  _createQuiz(lessonId, questions = []) {
    return Promise.all(questions.map(question => this._createQuestion(lessonId, question)))
  },

  _updateQuizQuestions(questions = []) {
    return Promise.all(questions.map(question => this._updateQuestion(question)))
  },

  create(data) {
    const id = uuidV4()

    const params = {
      TableName: config.tables.lessons,
      Item: {
        id,
        titleEn: data.titleEn || 'null',
        titleEnLower: data.titleEn.toLowerCase(),
        objectivesEn: data.objectivesEn || 'null',
        titleEs: data.titleEs || 'null',
        // "titleEsLower": allData.titleEs.toLowerCase(),
        objectivesEs: data.objectivesEs || 'null',
        preview: data.preview || 'null',
        creationDate: moment().unix(),
        status: 'OK',
        draft: data.draft || false,
        subjectId: data.subject || 'null',
        standards: data.standards || 'null',
        level: -1,
        invite: data.invite,
        sorting: {
          pipe: data.sorting.pipe || 'null',
          pipePosition: data.sorting.pipePosition || 'top',
          pipeRotate: data.sorting.pipeRotate || '0',
          tryCount: data.sorting.tryCount || '2',
          backgroundMusic: {
            src: data.sorting.backgroundMusic.src || 'null',
            repeat: data.sorting.backgroundMusic.repeat || false,
            on: data.sorting.backgroundMusic.on || false,
            delay: data.sorting.backgroundMusic.delay || 0,
            loud: data.sorting.backgroundMusic.loud || 'normal'
          },
          question: data.sorting.question || 'null',
          background: data.sorting.background || 'null',
          bucket: data.sorting.bucket || 'null',
          elements: data.sorting.elements || 'null',
          time: data.sorting.time || 'null',
          timeValue: data.sorting.timeValue || 'sec',
          hasTimer: data.sorting.hasTimer || false,
          targetArea: data.sorting.targetArea || 'null',
          perRow: data.sorting.perRow || 0,
          successes: data.sorting.successes || [],
          fails: data.sorting.fails || [],
          elementsContainer: data.sorting.elementsContainer || 'null'
        },
        ordering: data.ordering || 'null'
      }
    }

    return db
      .put(params)
      .promise()
      .then(() =>
        this._createPresentation(id, data.presentation)
        // Promise.all([this._createPresentation(id, data.presentation), this._createQuiz(id, data.quiz.questions)])
      )
      .then(data => {
        console.dir(data)
        return id
      })
  },
  _updateQuiz(lessonId, quiz) {
    const shouldUpdate = quiz || quiz.questions || quiz.questions.length === 0
    if (!shouldUpdate) {
      return Promise.resolve()
    }

    const newQuestions = quiz.questions.filter(question => isLogicalEmpty(question.id))

    const updateQuestions = quiz.questions.filter(question => !isLogicalEmpty(question.id))

    const deletedQuestions = quiz.questions.filter(question => question.isDeleted)

    return Promise.all([
      ...this._createQuiz(lessonId, newQuestions),
      ...this._updateQuizQuestions(updateQuestions),
      ...deletedQuestions.map(item => this._deleteQuestion(item))
    ])
  },

  _updatePresentation(lessonId, presentation) {
    const params = {
      TableName: config.tables.presentations,
      Key: {
        id: lessonId
      },
      UpdateExpression: 'set lessonId = :lessonId, slides = :slides, backgroundMusic = :backgroundMusic',
      ExpressionAttributeValues: {
        ':lessonId': lessonId,
        ':slides': presentation.slides,
        ':backgroundMusic': presentation.backgroundMusic
      },
      ReturnValues: 'UPDATED_OLD'
    }

    console.info(`_updatePresentation`)
    console.dir(params)

    return db.update(params).promise()
      .then(res => {
        console.log('res ===>')
        console.dir(res)

        return res
      })
  },

  updateById(id, data) {
    const params = {
      TableName: config.tables.lessons,
      Key: {
        id: id.toString(),
        creationDate: Number(data.creationDate)
      },
      UpdateExpression:
        'set titleEn = :engTitle, objectivesEn = :engDesc, titleEnLower = :lower_engTitle,' +
        'titleEs = :esTitle, objectivesEs = :esDesc, preview = :img, updatedDate = :updDate, #inv = :inv,' +
        'sorting = :sorting, ordering = :order, subjectId = :subj, draft = :draft, #res = :res, standards = :standards',
      ExpressionAttributeNames: {
        '#res': 'result',
        '#inv': 'invite'
      },
      ExpressionAttributeValues: {
        ':engTitle': data.titleEn,
        ':lower_engTitle': data.titleEn.toLowerCase(),
        ':engDesc': data.objectivesEn || 'null',
        ':esTitle': data.titleEs || 'null',
        //":lower_esTitle": allData.titleEs.toLowerCase(),
        ':esDesc': data.objectivesEs || 'null',
        ':draft': data.draft || false,
        ':img': data.preview || 'null',
        ':updDate': Date.now(),
        ':sorting': data.sorting || 'null',
        ':order': data.ordering || 'null',
        ':subj': data.subject || 'null',
        ':res': data.result || 'null',
        ':inv': data.invite || 'null',
        ':standards': data.standards || 'null'
      },
      ReturnValues: 'UPDATED_NEW'
    }

    return db
      .update(params)
      .promise()
      .then(() => this._updateQuiz(id.toString(), data.quiz))
      .then(() => this._updatePresentation(id.toString(), data.presentation))
      .catch(err => {
        console.dir(err)
      })
  },

  deleteById(id, creationDate) {
    const params = {
      TableName: config.tables.lessons,
      Key: {
        id: id.toString(),
        creationDate: Number(creationDate)
      }
    }

    return db.delete(params).promise()
  },

  getStudentLessons(studentId) {
    let params = {
      TableName: config.tables.lessons
    }

    return db
      .scan(params)
      .promise()
      .then(data => {
        data.Items = data.Items.filter(lesson => {
          return lesson.invite.students.indexOf(studentId) !== -1
        })

        data.Items.forEach(function (item) {
          delete item.titleEnLower
          delete item.status
          delete item.invite
          delete item.titleEsLower
        })

        return data
      })
  },
  isPlayedByCurrentUser(studentId, lessonId) {
    const params = {
      TableName: config.tables.game_result,
      FilterExpression: 'studentId = :studentId and lessonId = :lessonId',
      ExpressionAttributeValues: {
        ':studentId': studentId,
        ':lessonId': lessonId
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => data.Items.length > 0)
  },
  results(lessonId, studentId, data) {
    const idOfNewElement = uuidV4()

    const params = {
      TableName: config.tables.game_result,
      Item: {
        id: idOfNewElement,
        lessonId: lessonId,
        studentId: studentId,
        creationDate: moment().unix(),
        result: data,
        status: 'OK'
      }
    }

    return db.put(params).promise()
  }
})
