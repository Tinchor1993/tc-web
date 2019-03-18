let AWS = require('aws-sdk')

const uuidV4 = require('uuid/v4')
const moment = require('moment')
const config = require('../../../config.json')
let tableElements = `${config.tablename.table_elements}`
let docClient = new AWS.DynamoDB.DocumentClient()

class ElementsDAO {
  createElement(data) {
    const idOfNewElement = uuidV4()
    let params = {
      TableName: tableElements,
      Item: {
        id: idOfNewElement,
        titleEn: data.titleEn,
        titleEnLower: data.titleEn.toLowerCase(),
        descriptionEn: data.descriptionEn || 'null',
        titleEs: data.titleEs || 'null',
        folderId: data.folder || 'null',
        //"titleEsLower": data.titleEs.toLowerCase() || "null",
        descriptionEs: data.descriptionEs || 'null',
        type: data.type || 'null',
        media: data.media || 'null',
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

  getElementById(id) {
    let params = {
      TableName: tableElements,
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
            delete item.titleEnLower
            delete item.titleEsLower
            delete item.status
          })
          return resolve(data)
        }
      })
    })
  }

  getElements(size, id, creationDate, status) {
    let params = {
      TableName: tableElements,
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
            delete item.titleEsLower
            delete item.status
          })
          return resolve(data)
        }
      })
    })
  }

  getElementsByFolderId(folderId) {
    const params = {
      TableName: tableElements,
      FilterExpression: 'folderId = :folderId',
      ExpressionAttributeValues: {
        ':folderId': folderId
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
  getElementsByName(name, size, id, creationDate, status, total, globalData) {
    name = name.toLowerCase()
    return new Promise((resolve, reject) => {
      let params = {
        TableName: tableElements,
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
              this.getElementsByName(
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

  getElementsByType(type) {
    let params = {
      TableName: tableElements,
      FilterExpression: '#el_type = :el_type',
      ExpressionAttributeNames: {
        '#el_type': 'type'
      },
      ExpressionAttributeValues: {
        ':el_type': type
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

  deleteElement(id, creationDate) {
    let params = {
      TableName: tableElements,
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

  updateElement(data, id) {
    let params = {
      TableName: tableElements,
      Key: {
        id: id,
        creationDate: data.creationDate
      },
      UpdateExpression: `
        set titleEn = :titleEn,
            titleEnLower = :titleEnLower,
            titleEs = :titleEs,
            media = :media,
            #tp = :type,
            descriptionEn = :descriptionEn,
            descriptionEs = :descriptionEs,
            folderId = :folderId
      `,
      ExpressionAttributeNames: {
        '#tp': 'type'
      },
      ExpressionAttributeValues: {
        ':titleEn': data.titleEn,
        ':titleEnLower': data.titleEn.toLowerCase(),
        ':descriptionEn': data.descriptionEn || 'null',
        ':titleEs': data.titleEs || 'null',
        //":titleEsLower": data.titleEs.toLowerCase(),
        ':descriptionEs': data.descriptionEs || 'null',
        ':type': data.type || 'null',
        ':media': data.media || 'null',
        ':folderId': data.folder || 'null'
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

  unpinElementFromFolder(id, creationDate) {
    let params = {
      TableName: tableElements,
      Key: {
        id: id,
        creationDate: creationDate
      },
      UpdateExpression: `
        set folderId = :folderId
      `,
      ExpressionAttributeValues: {
        ':folderId': 'null'
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
}

export default new ElementsDAO()
