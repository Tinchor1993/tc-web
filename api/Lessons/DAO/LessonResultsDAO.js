const AWS = require('aws-sdk')
const uuidV4 = require('uuid/v4')
const moment = require('moment')
const docClient = new AWS.DynamoDB.DocumentClient()
const config = require('../../../config.json')
const tableName = `${config.tablename.table_game_result}`

class LessonResultsDAO {
  createResult(lessonId, studentId, data) {
    const idOfNewElement = uuidV4()
    const params = {
      TableName: tableName,
      Item: {
        id: idOfNewElement,
        lessonId: lessonId,
        studentId: studentId,
        creationDate: moment().unix(),
        result: data,
        status: 'OK'
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

  getResultsByStudentId(studentId) {
    const params = {
      TableName: tableName,
      FilterExpression: 'studentId = :studentId',
      ExpressionAttributeValues: {
        ':studentId': studentId
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

  getResultsByLessonId(lessonId) {
    const params = {
      TableName: tableName,
      FilterExpression: 'lessonId = :lessonId',
      ExpressionAttributeValues: {
        ':lessonId': lessonId
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

  getResultById(id) {
    const params = {
      TableName: tableName,
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
          return resolve(data)
        }
      })
    })
  }
  getAllResults(size, id, creationDate, status) {
    let params = {
      TableName: tableName,
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
          return resolve(data)
        }
      })
    })
  }
  deleteResultById(id, creationDate) {
    let params = {
      TableName: tableName,
      Key: {
        id: id.toString(),
        creationDate: creationDate
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

  isPlayedByCurrentUser(studentId, lessonId) {
    const params = {
      TableName: tableName,
      FilterExpression: 'studentId = :studentId and lessonId = :lessonId',
      ExpressionAttributeValues: {
        ':studentId': studentId,
        ':lessonId': lessonId
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          if (data.Items.length > 0) {
            return resolve(true)
          } else {
            return resolve(false)
          }
        }
      })
    })
  }
}
export default new LessonResultsDAO()
