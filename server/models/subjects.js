const uuidV4 = require("uuid/v4")
const moment = require("moment")

export default ({ config, db }) => ({
  getAll(size, id, creationDate, status) {
    let params = {
      TableName: config.tables.subjects,
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
        return data.Items
      })
  },
  getById(id) {
    let params = {
      TableName: config.tables.subjects,
      KeyConditionExpression: "#idd = :idd",
      ExpressionAttributeNames: {
        "#idd": "id"
      },
      ExpressionAttributeValues: {
        ":idd": id
      }
    }

    return db
      .query(params)
      .promise()
      .then(data => {
        if (data.Count === 0) {
          throw Error("Subject not found.")
        }

        return data.Items[0]
      })
  },
  getSubjectByName(name, size, id, creationDate, status, total, globalData) {
    name = name.toLowerCase()
    return new Promise((resolve, reject) => {
      let params = {
        TableName: config.tables.subjects,
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

      db.query(params, (err, data) => {
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
  },
  updateById(id, data) {
    const {
      titleEn = "empty",
      titleEs = "empty",
      preview = "empty",
      creationDate
    } = data

    let params = {
      TableName: config.tables.subjects,
      Key: {
        id,
        creationDate
      },
      UpdateExpression: `
        set titleEn = :titleEn,
            titleEnLower = :titleEnLower,
            titleEs = :titleEs,
            titleEsLower = :titleEsLower,
            preview = :preview
      `,
      ExpressionAttributeValues: {
        ":titleEn": titleEn,
        ":titleEnLower": titleEn.toLowerCase(),

        ":titleEs": titleEs,
        ":titleEsLower": titleEs.toLowerCase(),

        ":preview": preview
      },
      ReturnValues: "UPDATED_NEW"
    }

    return db.update(params).promise()
  },
  create(data) {
    const { titleEn = "empty", titleEs = "empty", preview = "empty" } = data

    let idOfNewElement = uuidV4()
    const params = {
      TableName: config.tables.subjects,
      Item: {
        id: idOfNewElement,
        quantity: 0,
        titleEn: titleEn,
        titleEnLower: titleEn.toLowerCase(),
        titleEs: titleEs,
        titleEsLower: titleEs.toLowerCase(),
        preview: preview,
        creationDate: moment().unix(),
        status: "OK"
      }
    }

    return db
      .put(params)
      .promise()
      .then(() => idOfNewElement)
  },
  removeById(id, creationDate) {
    let params = {
      TableName: config.tables.subjects,
      Key: {
        id: id.toString(),
        creationDate: Number(creationDate)
      }
    }

    return db.delete(params).promise()
  },
  getLessonsBySubjectId(subjectId) {
    const params = {
      TableName: config.tables.lessons,
      FilterExpression: 'subjectId = :sub',
      ExpressionAttributeValues: {
        ':sub': subjectId
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => data.Items)
  }
})
