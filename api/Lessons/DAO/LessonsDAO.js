import LessonQuizzzesDAO from './LessonQuizzzesDAO'

const uuidV4 = require('uuid/v4')
const moment = require('moment')
const lodash = require('lodash')
const config = require('../../../config.json')
const tableLessons = `${config.tablename.table_lessons}`
const tablePresentations = `${config.tablename.table_presentations}`
const tableQuizzes = `${config.tablename.table_quiz}`
const tableAnswers = `${config.tablename.table_answers}`


class LessonsDAO {
  isStudentHasAccess(studentId, lessonsId) {
    console.log(studentId, lessonsId)
    const params = {
      TableName: tableLessons,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': lessonsId
      }
    }
    return new Promise((resolve, reject) => {
      docClient.query(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          data.Items[0].invite.students.forEach(function(item) {
            if (item === studentId) {
              return resolve(true)
            }
          })
          return resolve(false)
        }
      })
    })
  }

  createLesson(allData) {
    allData = lodash.defaultsDeep({}, allData, defaultLesson)

    if (allData.sorting.backgroundMusic === undefined) {
      allData.sorting.backgroundMusic = {}
    }
    if (allData.quiz.questions === undefined) {
      allData.quiz.questions = []
    }
    allData.quiz.questions.map(question => {
      if (question.backgroundMusic === undefined) {
        question.backgroundMusic = {}
        console.log(question)
      }
    })
    if (allData.presentation.backgroundMusic === undefined) {
      allData.presentation.backgroundMusic = {}
    }
    allData.sorting.elements.forEach(function(item) {
      delete item.creationDate
      delete item.objectivesEn
      delete item.objectivesEs
      delete item.media
      delete item.titleEn
      delete item.titleEs
      delete item.type
      if (item.isCorrect !== true && item.isCorrect !== false) {
        item.isCorrect = false
      }
    })
    if (allData.sorting.pipe === undefined) {
      allData.sorting.pipe = null
    }

    if (allData.sorting.pipePosition === undefined) {
      allData.sorting.pipePosition = 'top'
    }

    if (allData.sorting.result === undefined) {
      allData.sorting.result = {}
      allData.sorting.result.win = {}
      allData.sorting.result.fail = {}
    }
    const idOfNewElement = uuidV4()
    const paramsForLesson = {
      TableName: tableLessons,
      Item: {
        id: idOfNewElement,
        titleEn: allData.titleEn || 'null',
        titleEnLower: allData.titleEn.toLowerCase(),
        objectivesEn: allData.objectivesEn || 'null',
        titleEs: allData.titleEs || 'null',
        //  "titleEsLower": allData.titleEs.toLowerCase(),
        objectivesEs: allData.objectivesEs || 'null',
        preview: allData.preview || 'null',
        creationDate: moment().unix(),
        status: 'OK',
        draft: allData.draft || false,
        subjectId: allData.subject || 'null',
        standards: allData.standards || 'null',
        level: -1,
        invite: allData.invite,
        result: {
          onSuccess: {
            text: allData.result.onSuccess.text || 'null'
          },
          onFailure: {
            text: allData.result.onFailure.text || 'null'
          }
        },
        sorting: {
          pipe: allData.sorting.pipe || 'null',
          pipePosition: allData.sorting.pipePosition || 'top',
          pipeRotate: allData.sorting.pipeRotate || '0',
          tryCount: allData.sorting.tryCount || '2',
          backgroundMusic: {
            src: allData.sorting.backgroundMusic.src || 'null',
            repeat: allData.sorting.backgroundMusic.repeat || false,
            on: allData.sorting.backgroundMusic.on || false,
            delay: allData.sorting.backgroundMusic.delay || 0,
            loud: allData.sorting.backgroundMusic.loud || 0
          },
          question: allData.sorting.question || 'null',
          background: allData.sorting.background || 'null',
          bucket: allData.sorting.bucket || 'null',
          elements: allData.sorting.elements || 'null',
          time: allData.sorting.time || 'null',
          timeValue: allData.sorting.timeValue || 'sec',
          hasTimer: allData.sorting.hasTimer || false,
          targetArea: allData.sorting.targetArea || 'null',
          perRow: allData.sorting.perRow || 0,
          successes: allData.sorting.successes || [],
          fails: allData.sorting.fails || [],
          elementsContainer: allData.sorting.elementsContainer || 'null'
        },
        ordering: allData.ordering || 'null'
      }
    }

    console.dir(paramsForLesson)
    
    return new Promise((resolve, reject) => {
      docClient.put(paramsForLesson, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          const paramsForPresentation = {
            TableName: tablePresentations,
            Item: {
              id: uuidV4(),
              slides: allData.presentation.slides || 'null',
              backgroundMusic: {
                src: allData.presentation.backgroundMusic.src || 'null',
                repeat: allData.presentation.backgroundMusic.repeat || false,
                on: allData.presentation.backgroundMusic.on || false,
                delay: allData.presentation.backgroundMusic.delay || 0,
                loud: allData.sorting.backgroundMusic.loud || 0
              },
              lessonId: idOfNewElement
            }
          }
          docClient.put(paramsForPresentation, function(err, data) {
            if (err) {
              return reject(err)
            }
          })

          const quiz_questions = allData.quiz.questions.map(
            (question, index) => {
              let idOfQuiz = uuidV4()
              const paramsForQuiz = {
                TableName: tableQuizzes,
                Item: {
                  id: idOfQuiz,
                  lessonId: idOfNewElement,
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
              docClient.put(paramsForQuiz, function(err, data) {
                if (err) {
                  return reject(err)
                } else {
                  if (!question.answers) question.answers = []
                  question.answers.forEach(function(item) {
                    const paramsForAnswers = {
                      TableName: tableAnswers,
                      Item: {
                        id: uuidV4(),
                        quizId: idOfQuiz,
                        isCorrect: item.isCorrect || false,
                        text: item.text || 'null',
                        element: item.element || 'null',
                        type: item.type || 'text',
                        media: item.media || 'null',
                        status: 'OK',
                        creationDate: moment().unix()
                      }
                    }
                    docClient.put(paramsForAnswers, function(err, data) {
                      if (err) {
                        return reject(err)
                      }
                    })
                  })
                }
              })
            }
          )
        }
        return resolve({ id: idOfNewElement })
      })
    })
  }

  updateLesson(id, allData) {
    allData = lodash.defaultsDeep({}, allData, defaultLesson)

    console.dir(allData)

    console.log('update start')
    allData.sorting.elements.forEach(function(item) {
      if (item.objectivesEn !== undefined) {
        delete item.creationDate
        delete item.objectivesEn
        delete item.objectivesEs
        delete item.media
        delete item.titleEn
        delete item.titleEs
        delete item.type
      }
    })
    if (allData.subject !== null && allData.subject !== undefined) {
      if (allData.subject.value !== undefined) {
        allData.subject = allData.subject.value
      }
    }
    if (allData.sorting.hasTimer === '') {
      allData.sorting.hasTimer = false
    }

    if (allData.sorting.pipe === undefined) {
      allData.sorting.pipe = null
    }

    if (allData.sorting.pipePosition === undefined) {
      allData.sorting.pipePosition = 'top'
    }

    let params = {
      TableName: tableLessons,
      Key: {
        id: id,
        creationDate: allData.creationDate
      },
      UpdateExpression:
        'set titleEn = :engTitle, objectivesEn = :engDesc, titleEnLower = :lower_engTitle,' +
        'titleEs = :esTitle, objectivesEs = :esDesc, preview = :img, updatedDate = :updDate, #inv = :inv,' +
        'sorting = :sorting, ordering = :order, subjectId = :subj, draft = :draft, #res = :result, standards = :standards',
      ExpressionAttributeNames: {
        '#res': 'result',
        '#inv': 'invite'
      },
      ExpressionAttributeValues: {
        ':engTitle': allData.titleEn,
        ':lower_engTitle': allData.titleEn.toLowerCase(),
        ':engDesc': allData.objectivesEn || 'null',
        ':esTitle': allData.titleEs || 'null',
        //":lower_esTitle": allData.titleEs.toLowerCase(),
        ':esDesc': allData.objectivesEs || 'null',
        ':draft': allData.draft || false,
        ':img': allData.preview || 'null',
        ':updDate': Date.now(),
        // ":sorting": allData.sorting || "null",
        ':order': allData.ordering || 'null',
        ':subj': allData.subject || 'null',
        ':result': allData.result || 'null',
        ':inv': allData.invite || 'null',
        ':standards': allData.standards || 'null'
      },
      ReturnValues: 'UPDATED_NEW'
    }

    let paramsForPresentation = {
      TableName: tablePresentations,
      Key: {
        id: allData.presentation && allData.presentation.id
      },
      UpdateExpression:
        'set slides = :slides, backgroundMusic = :backgroundMusic',
      ExpressionAttributeValues: {
        ':slides': allData.presentation.slides || 'null',
        ':backgroundMusic': allData.presentation.backgroundMusic || 'null'
      }
    }

    return new Promise((resolve, reject) => {
      docClient.update(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          console.log('update start')
          docClient.update(paramsForPresentation, function(err, data) {
            if (err) {
              return reject(err)
            } else {
              allData.quiz.questions.map(question => {
                if (question.id === undefined) {
                  LessonQuizzzesDAO.createBase(
                    allData.id,
                    question,
                    allData.quiz.layout
                  ).then(quizId => {
                    question.answers.forEach(function(item) {
                      const paramsForAnswers = {
                        TableName: tableAnswers,
                        Item: {
                          id: uuidV4(),
                          quizId: quizId,
                          isCorrect: item.isCorrect || false,
                          text: item.text || 'null',
                          type: item.type || 'text',
                          element: item.element || 'element',
                          media: item.media || 'null',
                          status: 'OK',
                          creationDate: moment().unix()
                        }
                      }
                      docClient.put(paramsForAnswers, function(err, data) {
                        if (err) {
                          return reject(err)
                        }
                      })
                    })
                  })
                } else if (question.isDeleted !== undefined) {
                  let params = {
                    TableName: tableQuizzes,
                    Key: {
                      id: question.id.toString(),
                      creationDate: question.creationDate
                    }
                  }
                  console.log('update start')
                  return new Promise((resolve, reject) => {
                    docClient.delete(params, function(err, data) {
                      if (err) {
                        return reject(err)
                      }
                    })
                  })
                } else {
                  const paramsForQuizQuestion = {
                    TableName: tableQuizzes,
                    Key: {
                      id: question.id
                    },
                    UpdateExpression:
                      'set #quest = :quest, #layo = :layout, backgroundMusic = :backgroundMusic, showDescription=:showDescription',
                    ExpressionAttributeNames: {
                      '#quest': 'text',
                      '#layo': 'layout'
                    },
                    ExpressionAttributeValues: {
                      ':showDescription': question.showDescription || false,
                      ':quest': question.text || 'null',
                      ':layout': question.layout || 'list',
                      ':backgroundMusic': question.backgroundMusic || 'null'
                    }
                  }
                  console.log('update start')
                  docClient.update(paramsForQuizQuestion, function(err, data) {
                    if (err) {
                      return reject(err)
                    }
                  })
                  question.answers.map(item => {
                    if (item.id === undefined) {
                      const params = {
                        TableName: tableAnswers,
                        Item: {
                          id: uuidV4(),
                          isCorrect: item.isCorrect || false,
                          creationDate: moment().unix(),
                          text: item.text || 'null',
                          type: item.type || 'text',
                          element: item.element || 'null',
                          media: item.media || 'null',
                          quizId: question.id,
                          status: 'OK'
                        }
                      }
                      docClient.put(params, function(err, data) {
                        if (err) {
                          return reject(err)
                        }
                      })
                    } else if (item.isDeleted !== undefined) {
                      console.log('update start')
                      let params = {
                        TableName: tableAnswers,
                        Key: {
                          id: item.id.toString(),
                          creationDate: item.creationDate
                        }
                      }
                      return new Promise((resolve, reject) => {
                        docClient.delete(params, function(err, data) {
                          if (err) {
                            return reject(err)
                          }
                        })
                      })
                    } else {
                      let paramsForAnswers = {
                        TableName: tableAnswers,
                        Key: {
                          id: item.id,
                          creationDate: item.creationDate
                        },
                        UpdateExpression:
                          'set #txt = :txt, #iscorr = :iscorr, #med = :med, #elem=:elem',
                        ExpressionAttributeNames: {
                          '#txt': 'text',
                          '#iscorr': 'isCorrect',
                          '#med': 'media',
                          '#elem': 'element'
                        },
                        ExpressionAttributeValues: {
                          ':txt': item.text || 'null',
                          ':iscorr': item.isCorrect || false,
                          ':med': item.media || 'null',
                          ':elem': item.element || 'null'
                        },
                        ReturnValues: 'UPDATED_NEW'
                      }
                      console.log('update start')
                      docClient.update(paramsForAnswers, function(err, data) {
                        if (err) {
                          return reject(err)
                        }
                      })
                    }
                  })
                }
              })
            }
            return resolve({ id })
          })
        }
      })
    })
  }

  deleteLesson(id, creationDate) {
    let params = {
      TableName: tableLessons,
      Key: {
        id: id.toString(),
        creationDate: Number(creationDate)
      }
    }
    return new Promise((resolve, reject) => {
      docClient.delete(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }

  getLessonsGameSelector(studentId) {
    let params = {
      TableName: tableLessons
    }

    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          data.Items = data.Items.filter(lesson => {
            return lesson.invite.students.indexOf(studentId) !== -1
          })
          data.Items.forEach(function(item) {
            delete item.titleEnLower
            delete item.status
            delete item.invite
            delete item.titleEsLower
          })

          return resolve(data)
        }
      })
    })
  }

  getLessons(size, id, creationDate, status) {
    let params = {
      TableName: tableLessons,
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

    if (id !== undefined) {
      params.ExclusiveStartKey.id = id
      params.ExclusiveStartKey.creationDate = Number(creationDate)
      params.ExclusiveStartKey.status = status
    } else {
      delete params.ExclusiveStartKey
    }

    return new Promise((resolve, reject) => {
      docClient.query(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          data.Items.forEach(function(item) {
            delete item.titleEnLower
            delete item.status
            delete item.invite
            delete item.titleEsLower
          })

          return resolve(data)
        }
      })
    })
  }

  getLessonsByName(name, size, id, creationDate, status, total, globalData) {
    name = name.toLowerCase()
    return new Promise((resolve, reject) => {
      let params = {
        TableName: tableLessons,
        FilterExpression:
          'contains(#el_name ,:el_name) or contains(#es_el_name, :el_name)',
        ExpressionAttributeNames: {
          '#el_name': 'titleEnLower',
          '#es_el_name': 'titleEsLower'
        },
        ExpressionAttributeValues: {
          ':el_name': name
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
        Limit: size,
        ExclusiveStartKey: {
          id: '',
          creationDate: '',
          status: ''
        },
        ScanIndexForward: false
      }
      if (id !== undefined) {
        params.ExclusiveStartKey.id = id
        params.ExclusiveStartKey.creationDate = Number(creationDate)
        params.ExclusiveStartKey.status = status
      } else {
        delete params.ExclusiveStartKey
      }

      docClient.query(params, (err, data) => {
        if (err) {
          return reject(err)
        } else {
          data.Items.forEach(function(item) {
            delete item.titleEnLower
            delete item.titleEsLower
            delete item.status
            total++
            if (total <= size) globalData.push(item)
          })
          if (total >= size || data.LastEvaluatedKey === undefined) {
            return resolve(globalData)
          } else {
            return resolve(
              this.getLessonsByName(
                name,
                size,
                data.LastEvaluatedKey.id,
                data.LastEvaluatedKey.creationDate,
                data.LastEvaluatedKey.status,
                total,
                globalData
              )
            )
          }
        }
      })
    })
  }

  getLessonById(id) {
    let params = {
      TableName: tableLessons,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': id
      }
    }
    return new Promise((resolve, reject) => {
      docClient.query(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          data.Items.forEach(function(item) {
            item.subject = item.subjectId
            delete item.subjectId
            delete item.titleEnLower
            delete item.titleEsLower
            delete item.status
          })
          return resolve(data)
        }
      })
    })
  }

  bubbleSort(lessons) {
    return new Promise((resolve, reject) => {
      let len = lessons.length
      for (let i = len - 1; i >= 0; i--) {
        for (let j = 1; j <= i; j++) {
          if (lessons[j - 1].level > lessons[j].level) {
            let temp = lessons[j - 1]
            lessons[j - 1] = lessons[j]
            lessons[j] = temp
          }
        }
      }
      return resolve(lessons)
    })
  }
}

export default new LessonsDAO()
