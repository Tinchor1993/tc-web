const AWS = require('aws-sdk')
const uuidV4 = require('uuid/v4')
const moment = require('moment')
const config = require('../../../config.json')
let tablename = `${config.tablename.table_elements_type}`
let globalData = []
let docClient = new AWS.DynamoDB.DocumentClient()

class ElementTypesDAO {
  createElementType(data) {
    const id = uuidV4()
    const params = {
      TableName: tablename,
      Item: {
        id: id,
        type: data.label
      }
    }

    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve({ id })
        }
      })
    })
  }

  updateElementType(id, data) {
    let params = {
      TableName: tablename,
      Key: {
        id: id
      },
      UpdateExpression: 'set #tp = :type',
      ExpressionAttributeNames: {
        '#tp': 'type'
      },
      ExpressionAttributeValues: {
        ':type': data.type
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
  getElementTypesByName(name) {
    let params = {
      TableName: tablename,
      FilterExpression: 'contains(#el_name ,:el_name)',
      ExpressionAttributeNames: {
        '#el_name': 'type'
      },
      ExpressionAttributeValues: {
        ':el_name': name
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

  getElementTypes() {
    const params = {
      TableName: tablename
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          data.Items.forEach(function(item) {
            delete item.titleEnLower
            delete item.status
            delete item.titleEsLower
          })

          return resolve(data)
        }
      })
    })
  }

  getElementTypeById(id) {
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
          return resolve(data)
        }
      })
    })
  }

  deleteElementType(id) {
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
}

export default new ElementTypesDAO()
