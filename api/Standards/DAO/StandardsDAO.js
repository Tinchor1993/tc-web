const AWS = require('aws-sdk')

const uuidV4 = require('uuid/v4')
const moment = require('moment')
const config = require('../../../config.json')
let tablename = `${config.tablename.table_standards}`
let docClient = new AWS.DynamoDB.DocumentClient()

class StandardsDAO {
  createStandard(data) {
    const idOfNewElement = uuidV4()
    const params = {
      TableName: tablename,
      Item: {
        id: idOfNewElement,
        name: data.name,
        creationDate: moment().unix(),
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

  getStandards(size, id, creationDate, status) {
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
      docClient.query(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          data.Items.forEach(function(item) {
            delete item.status
          })
          return resolve(data)
        }
      })
    })
  }

  getStandardById(id) {
    const params = {
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
            delete item.status
          })
          return resolve(data)
        }
      })
    })
  }

  updateStandardById(data, id) {
    let params = {
      TableName: tablename,
      Key: {
        id: id,
        creationDate: data.creationDate
      },
      UpdateExpression: 'set #nm = :name',
      ExpressionAttributeNames: {
        '#nm': 'name'
      },
      ExpressionAttributeValues: {
        ':name': data.name
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

  deleteStandard(id, creationDate) {
    const params = {
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
}

export default new StandardsDAO()
