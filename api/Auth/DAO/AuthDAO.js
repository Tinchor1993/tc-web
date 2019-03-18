const AWS = require('aws-sdk')
const config = require('../../../config.json')
const tableUsers = `${config.tablename.table_users}`
const tableStudents = `${config.tablename.table_students}`
const docClient = new AWS.DynamoDB.DocumentClient()
class AuthDAO {
  updateGoogleId(id, creationDate, googleId) {
    const params = {
      TableName: tableStudents,
      Key: {
        id: id,
        creationDate: creationDate
      },
      UpdateExpression: 'set googleId = :googleId',
      ExpressionAttributeValues: {
        ':googleId': googleId
      }
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
  singIn(login, password) {
    let params = {
      TableName: tableUsers,
      FilterExpression: '#login = :login and #pswd = :password',
      ExpressionAttributeNames: {
        '#pswd': 'password',
        '#login': 'login'
      },
      ExpressionAttributeValues: {
        ':login': login,
        ':password': password
      }
    }

    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          console.error(
            'Unable to read item. Error JSON:',
            JSON.stringify(err, null, 2)
          )
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }
  isInvited(email) {
    const params = {
      TableName: tableStudents,
      FilterExpression: '#mail = :email and #act = :bool',
      ExpressionAttributeNames: {
        '#mail': 'email',
        '#act': 'active'
      },
      ExpressionAttributeValues: {
        ':email': email,
        ':bool': true
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          console.error(
            'Unable to read item. Error JSON:',
            JSON.stringify(err, null, 2)
          )
          return reject(err)
        } else {
          let response = {}

          if (data.Items.length > 0) {
            response.bool = true
            response.id = data.Items[0].id
            response.creationDate = data.Items[0].creationDate
            return resolve(response)
          } else {
            response.bool = false
            return resolve(response)
          }
        }
      })
    })
  }
}
export default new AuthDAO()
