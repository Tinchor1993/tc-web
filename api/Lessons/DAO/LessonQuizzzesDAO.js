let AWS = require('aws-sdk'),
  fs = require('fs')
const uuidV4 = require('uuid/v4')
import LessonQuizAnswersDAO from './LessonQuizQuestionAnswersDAO'

const docClient = new AWS.DynamoDB.DocumentClient()
const config = require('../../../config.json')
const tablename = `${config.tablename.table_quiz}`

class LessonsQuizDAO {
  createLessonQuizzes(lessonId) {
    const idOfNewElement = uuidV4()
    const params = {
      TableName: tablename,
      Item: {
        id: idOfNewElement,
        question: data.question,
        lessonId: lessonId
      }
    }

    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(idOfNewElement)
        }
      })
    })
  }

  createBase(lessonId, data, layout) {
    const idOfQuiz = uuidV4()
    if (data.backgroundMusic === undefined) {
      data.backgroundMusic = {}
    }
    const params = {
      TableName: tablename,
      Item: {
        id: idOfQuiz,
        lessonId: lessonId,
        text: data.text || 'null',
        showDescription: data.showDescription || false,
        layout: layout || 'list',
        backgroundMusic: {
          src: data.backgroundMusic.src || 'null',
          repeat: data.backgroundMusic.repeat || false,
          on: data.backgroundMusic.on || false,
          delay: data.backgroundMusic.delay || 0,
          loud: data.backgroundMusic.loud || 0
        }
      }
    }
    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
        if (err) {
          return reject(err)
        }
        resolve(idOfQuiz)
      })
    })
  }

  updateLessonQuizzes(id, data) {
    let params = {
      TableName: tablename,
      Key: {
        id: id
      },
      UpdateExpression: 'set lessonId = :lessonIdd',
      ExpressionAttributeValues: {
        ':lessonIdd': data.lessonId
      },
      ReturnValues: 'UPDATED_NEW'
    }

    return new Promise((resolve, reject) => {
      docClient.update(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }

  deleteLessonQuizzes(id) {
    let params = {
      TableName: tablename,
      Key: {
        id: id.toString()
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

  getQuizById(quizId) {
    let params = {
      TableName: tablename,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': quizId
      }
    }
    return new Promise((resolve, reject) => {
      docClient.query(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }

  getQuestionsAndAnswersByLessonId(id) {
    return new Promise((resolve, reject) => {
      let quiz = {}
      this.getQuizzesByLessonId(id).then(data => {
        let questions = data.Items

        quiz.layout = questions[0] && questions[0].layout
        quiz.backgroundMusic = questions[0] && questions[0].backgroundMusic

        let quizQuestions = questions.map((question, index) => {
          return LessonQuizAnswersDAO.getAnswersByQuizId(question.id).then(
            answers => {
              question.answers = answers.Items
              return question
            }
          )
        })
        Promise.all(quizQuestions).then(data => {
          quiz.questions = data
          resolve(quiz)
        })
      })
    })
  }

  getQuizzesByLessonId(id) {
    let params = {
      TableName: tablename,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'lessonId'
      },
      ExpressionAttributeValues: {
        ':idd': id
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }
}

export default new LessonsQuizDAO()
