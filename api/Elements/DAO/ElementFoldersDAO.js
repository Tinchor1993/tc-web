const AWS = require('aws-sdk')
const uuidV4 = require('uuid/v4')
const moment = require('moment')
const config = require('../../../config.json')
let tableFolders = `${config.tablename.table_element_folders}`
let docClient = new AWS.DynamoDB.DocumentClient()

class ElementFoldersDAO {
  getFolderById(id) {
    let params = {
      TableName: tableFolders,
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
          return resolve(data.Items[0])
        }
      })
    })
  }
  createFolderElement(data) {
    const id = uuidV4()
    const params = {
      TableName: tableFolders,
      Item: {
        id: id,
        title: data.label
      }
    }
    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, response) {
        if (err) {
          return reject(err)
        } else {
          return resolve({ id })
        }
      })
    })
  }

  getFolders() {
    const params = {
      TableName: tableFolders
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

  deleteFolder(id) {
    const params = {
      TableName: tableFolders,
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

  updateFolder(id, data) {
    const params = {
      TableName: tableFolders,
      Key: {
        id: id
      },
      UpdateExpression: 'set #tit = :title',
      ExpressionAttributeNames: {
        '#tit': 'title'
      },
      ExpressionAttributeValues: {
        ':title': data.title
      }
    }
  }
}

export default new ElementFoldersDAO()
