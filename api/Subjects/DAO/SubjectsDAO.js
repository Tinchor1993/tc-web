let AWS = require('aws-sdk'),
  fs = require('fs')
const uuidV4 = require('uuid/v4')
const moment = require('moment')
const docClient = new AWS.DynamoDB.DocumentClient()
const config = require('../../../config.json')
const unquote = require('unquote')
const tablename = `${config.tablename.table_subjects}`
const tableLessons = `${config.tablename.table_lessons}`

class SubjectsDAO {
  createSubject(data) {
    let idOfNewElement = uuidV4()
    const params = {
      TableName: tablename,
      Item: {
        id: idOfNewElement,
        quantity: 0,
        titleEn: data.titleEn,
        titleEnLower: data.titleEn.toLowerCase(),
        titleEs: data.titleEs || 'null',
        //  "titleEsLower": data.titleEs.toLowerCase(),
        preview: data.preview || 'null',
        creationDate: moment().unix(),
        status: 'OK'
      }
    }

    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve({ id: idOfNewElement })
        }
      })
    })
  }
  getLessonsBySubjectId(subjectId) {
    const params = {
      TableName: tableLessons,
      FilterExpression: 'subjectId = :sub',
      ExpressionAttributeValues: {
        ':sub': subjectId
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, (err, data) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }
  updateSubject(id, data) {
    let params = {
      TableName: tablename,
      Key: {
        id: id,
        creationDate: data.creationDate
      },
      UpdateExpression: `
        set titleEn = :titleEn,
            titleEnLower = :titleEnLower,
            titleEs = :titleEs,
            titleEsLower = :titleEsLower,
            preview = :preview
      `,
      ExpressionAttributeValues: {
        ':titleEn': data.titleEn,
        ':titleEnLower': data.titleEn.toLowerCase(),

        ':titleEs': data.titleEs,
        ':titleEsLower': data.titleEs.toLowerCase(),

        ':preview': data.preview
      },
      ReturnValues: 'UPDATED_NEW'
    }

    return new Promise((resolve, reject) => {
      docClient.update(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve({ id })
        }
      })
    })
  }

  deleteSubject(id, creationDate) {
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

  getSubjects(size, id, creationDate, status) {
    let params = {
      TableName: tablename,
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
      docClient.query(params, (err, data) => {
        if (err) {
          return reject(err)
        } else {
          data.Items.forEach(function(item) {
            delete item.status
            delete item.titleEsLower
            delete item.titleEnLower
          })
          return resolve(data)
        }
      })
    })
  }

  getSubjectByName(name, size, id, creationDate, status, total, globalData) {
    name = name.toLowerCase()
    return new Promise((resolve, reject) => {
      let params = {
        TableName: tablename,
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
              this.getSubjectByName(
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

  getSubjectById(id) {
    let params = {
      TableName: tablename,
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
            delete item.titleEsLower
            delete item.titleEnLower
            delete item.status
          })
          return resolve(data)
        }
      })
    })
  }

  appendLevelToLesson(lessonId, creationDate, level) {
    let params = {
      TableName: tableLessons,
      Key: {
        id: lessonId,
        creationDate: creationDate
      },
      UpdateExpression: 'set #lvl = :level',
      ExpressionAttributeNames: {
        '#lvl': 'level'
      },
      ExpressionAttributeValues: {
        ':level': level
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
}

export default new SubjectsDAO()
