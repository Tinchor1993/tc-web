let AWS = require('aws-sdk'),
  fs = require('fs')
const uuidV4 = require('uuid/v4')

const docClient = new AWS.DynamoDB.DocumentClient()
const config = require('../../../config.json')
const tablename = `${config.tablename.table_questions}`

class LessonQuizQuestionsDAO {
  createQuestion(data, quizId) {
    const idOfNewElement = uuidV4()
    const params = {
      TableName: tablename,
      Item: {
        id: idOfNewElement,
        quizId: quizId,
        en_text: data.en_text,
        en_audio: data.en_audio,
        es_text: data.es_text,
        es_audio: data.es_audio
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

  updateQuestion(id, data) {
    let params = {
      TableName: tablename,
      Key: {
        id: id
      },
      UpdateExpression:
        'set en.#txt = :engText, en.audio = :engAudio,' +
        'es.#txt = :esText, es.audio = :esAudio',
      ExpressionAttributeNames: {
        '#txt': 'text'
      },
      ExpressionAttributeValues: {
        ':engText': data.en.text,
        ':engAudio': data.en.audio,
        ':esText': data.es.text,
        ':esAudio': data.es.audio
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

  deleteQuestion(id) {
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

  getQuestionById(questionId) {
    let params = {
      TableName: tablename,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': questionId
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

  getQuestionsByQuizId(quizId) {
    let params = {
      TableName: tablename,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'quizId'
      },
      ExpressionAttributeValues: {
        ':idd': quizId
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

export default new LessonQuizQuestionsDAO()
