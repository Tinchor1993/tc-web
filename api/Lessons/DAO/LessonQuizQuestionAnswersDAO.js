let AWS = require('aws-sdk'),
  fs = require('fs')
const uuidV4 = require('uuid/v4')

const docClient = new AWS.DynamoDB.DocumentClient()
const config = require('../../../config.json')
const tablename = `${config.tablename.table_answers}`

class LessonQuizAnswersDAO {
  createAnswer(data, quizId) {
    const idOfNewElement = uuidV4()
    const params = {
      TableName: tablename,
      Item: {
        id: idOfNewElement,
        correct: data.correct,
        text: data.text,
        quizId: quizId
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

  updateAnswer(id, data) {
    let params = {
      TableName: tablename,
      Key: {
        id: id
      },
      UpdateExpression: 'set #elem = :el, correct = :corr',
      ExpressionAttributeNames: {
        '#elem': 'element'
      },
      ExpressionAttributeValues: {
        ':corr': data.correct,
        ':el': data.element
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

  deleteAnswer(id, creationDate) {
    let params = {
      TableName: tablename,
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

  getAnswerById(answerId) {
    let params = {
      TableName: tablename,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': answerId
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

  getAnswersByQuizId(quizId) {
    let params = {
      TableName: tablename,
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
}

export default new LessonQuizAnswersDAO()
