const uuidV4 = require("uuid/v4")
const moment = require("moment")

export default ({ config, db }) => ({
  getAll(size, id, creationDate, status) {
    let params = {
      TableName: config.tables.elements,
      IndexName: "status-creationDate-index",
      KeyConditions: {
        status: {
          ComparisonOperator: "EQ",
          AttributeValueList: ["OK"]
        },
        creationDate: {
          ComparisonOperator: "BETWEEN",
          AttributeValueList: [0, 9999999999999999999]
        }
      },
      Limit: size,
      ExclusiveStartKey: {
        id: "",
        creationDate: "",
        status: ""
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

    return db
      .query(params)
      .promise()
      .then(data => {
        data.Items.forEach(function(item) {
          delete item.status
          delete item.titleEsLower
          delete item.titleEnLower
        })

        return data.Items
      })
  },
  getById(id) {
    let params = {
      TableName: config.tables.elements,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': id
      }
    }

    return db
      .query(params)
      .promise()
      .then(data => {
        return data.Items[0]
      })
  },
  create(data) {
    const id = uuidV4()
    
    let params = {
      TableName: config.tables.elements,
      Item: {
        id,
        titleEn: data.titleEn,
        titleEnLower: data.titleEn.toLowerCase(),
        descriptionEn: data.descriptionEn || 'null',
        titleEs: data.titleEs || 'null',
        folderId: data.folderId || 'null',
        // "titleEsLower": data.titleEs.toLowerCase() || "null",
        descriptionEs: data.descriptionEs || 'null',
        type: data.type || 'null',
        media: data.media || 'null',
        creationDate: moment().unix(),
        status: 'OK'
      }
    }

    return db
      .put(params)
      .promise()
      .then(() => id)
  },
  update(id, data) {
    let params = {
      TableName: config.tables.elements,
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
        ':descriptionEn': data.descriptionEn,
        ':titleEs': data.titleEs,
        //":titleEsLower": data.titleEs.toLowerCase(),
        ':descriptionEs': data.descriptionEs,
        ':type': data.type,
        ':media': data.media,
        ':folderId': data.folderId
      },
      ReturnValues: 'UPDATED_NEW'
    }
    
    return db
      .update(params)
      .promise()
  },
  deleteById(id, creationDate) {
    const params = {
      TableName: config.tables.elements,
      Key: {
        id: id.toString(),
        creationDate: Number(creationDate)
      }
    }
    
    return db.delete(params).promise()
  },
  getFolders() {
    const params = {
      TableName: config.tables.element_folders
    }

    return db.scan(params).promise().then(data => data.Items)
  },
  createFolder(data) {
    const id = uuidV4()
    
    const params = {
      TableName: config.tables.element_folders,
      Item: {
        id: id,
        title: data.title
      }
    }

    return db.put(params).promise().then(() => id)
  },
  deleteFolder(id, creationDate) {
    const params = {
      TableName: config.tables.element_folders,
      Key: {
        id: id.toString(),
        creationDate
      }
    }
    return db.delete(params).promise()
  },
  updateFolder(id, data) {
    const params = {
      TableName: config.tables.element_folders,
      Key: {
        id: id
      },
      UpdateExpression: 'set #tit = :title',
      ExpressionAttributeNames: {
        '#tit': 'title'
      },
      ExpressionAttributeValues: {
        ':title': data.title
      },
      ReturnValues: 'UPDATED_NEW'
    }

    return db
      .update(params)
      .promise()
  },
  getFolderById(id) {
    let params = {
      TableName: config.tables.element_folders,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': id
      }
    }

    return db
      .query(params)
      .promise()
      .then(data => {
        return data.Items[0]
      })
  },
  getElementbyFolderId(id) {

    const params = {
      TableName: config.tables.elements,
      FilterExpression: 'folderId = :folderId',
      ExpressionAttributeValues: {
        ':folderId': id
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => data.Items)

  }
  
})
