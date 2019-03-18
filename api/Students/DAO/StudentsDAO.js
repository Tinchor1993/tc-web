const aws = require('aws-sdk')
const uuidV4 = require('uuid/v4')
const config = require('../../../config.json')
const docClient = new aws.DynamoDB.DocumentClient()
const moment = require('moment')
const tablename = `${config.tablename.table_students}`
const tableToken = `${config.tablename.table_token}`
const nodemailer = require('nodemailer')
var xoauth2 = require("xoauth2"),
  xoauth2gen;
class StudentsDAO {
  searchByFullName(
    fullName,
    size,
    id,
    creationDate,
    status,
    total,
    globalData
  ) {
    fullName = fullName.toLowerCase()
    return new Promise((resolve, reject) => {
      let params = {
        TableName: tablename,
        FilterExpression: 'contains(#fullName ,:el_name)',
        ExpressionAttributeNames: {
          '#fullName': 'lowerFullName'
        },
        ExpressionAttributeValues: {
          ':el_name': fullName
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
          data.Items.forEach(function (item) {
            delete item.lowerFullName
            delete item.status
            total++
            if (total <= size) globalData.push(item)
          })
          if (total >= size || data.LastEvaluatedKey === undefined) {
            return resolve(globalData)
          } else {
            return resolve(
              this.searchByFullName(
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
  getAccessToken() {
    const params = {
      TableName: tableToken
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data.Items[0])
        }
      })
    })
  }
  updateAccessToken(token) {
    const params = {
      TableName: tableToken,
      Key: {
        id: '47151968-b471-4029-9e87-5f706b33da9a'
      },
      UpdateExpression: 'set #acToken = :acToken, #expir = :exp',
      ExpressionAttributeNames: {
        '#acToken': 'accessToken',
        '#expir': 'expires'
      },
      ExpressionAttributeValues: {
        ':acToken': token.accessToken,
        ':exp': token.expires
      }
    }
    return new Promise((resolve, reject) => {
      docClient.update(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }
  inviteStudent(name, surname, email, id, creationDate, accessToken, expires) {
    const isProduction = process.env.NODE_ENV === 'dev'
    const URL = isProduction
      ? 'http://localhost:8080/api/v1/students/' +
      id +
      '/activate/' +
      creationDate
      : 'http://18.214.21.95/api/v1/students/' +
      id +
      '/activate/' +
      creationDate
    console.log('invite url' + URL)

    return new Promise((resolve, reject) => {

      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: 'matthewvg@gmail.com',
          clientId: '141978543542-53vgb42tv6qq3r7mb5ndg1m0a6hq6fg9.apps.googleusercontent.com',
          clientSecret: 'LgfAbcPKrUDDQBw8bLf8Fljf',
          refreshToken: '1/lCJI4ndlBGdFefmstXbvFMQAvzMVYB2G8NoSAeUScs4',
          accessToken: 'ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x',
          expires: 1484314697598
        }
      });


      // Setup mail configuration
      let mailOptions = {
        from: 'matthewvg@gmail.com',
        to: email,
        subject: 'Thinking_capp',
        text:
          'Hello ' +
          name +
          ' ' +
          surname +
          '\n' +
          'Welcome to Thinking Capp' +
          '\n' +
          URL
      }
      // send mail
      smtpTransport.sendMail(mailOptions, function (error, info) {


        if (error) {
          console.log('sending email failed' + error)
          smtpTransport.close()
          reject(error)
        } else {
          console.log('sending email success' + response)
          smtpTransport.close()
          resolve(response)
        }
      });


    })
  }

  registerStudents(name, surname, email) {
    const idOfNewElement = uuidV4()
    const creationDate = moment().unix()
    const params = {
      TableName: tablename,
      Item: {
        id: idOfNewElement,
        fullName: name + ' ' + surname,
        lowerFullName: name.toLowerCase() + ' ' + surname.toLowerCase(),
        email: email,
        creationDate: creationDate,
        active: false,
        status: 'OK'
      }
    }
    return new Promise((resolve, reject) => {
      docClient.put(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve({ id: idOfNewElement, creationDate: creationDate })
        }
      })
    })
  }

  getStudentByGoogleId(googleId) {
    const params = {
      TableName: tablename,
      FilterExpression: 'googleId = :googleId',
      ExpressionAttributeValues: {
        ':googleId': googleId
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }

  getStudentById(studentId) {
    const params = {
      TableName: tablename,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': studentId
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }

  getStudentByEmail(email) {
    const params = {
      TableName: tablename,
      FilterExpression: '#mail = :email',
      ExpressionAttributeNames: {
        '#mail': 'email'
      },
      ExpressionAttributeValues: {
        ':email': email
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          data.Items.forEach(function (item) { })
          return resolve({ ...data, count: data.Count })
        }
      })
    })
  }
  getStudents() {
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
      ScanIndexForward: false
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          data.Items.forEach(function (item) {
            delete item.status
            delete item.creationDate
            if (item.active === false) {
              item.active = 'inactive'
            } else {
              item.active = 'active'
            }
          })
          return resolve(data)
        }
      })
    })
  }

  changeStatus(id, status, creationDate) {
    let params = {
      TableName: tablename,
      Key: {
        id: id,
        creationDate: Number(creationDate)
      },
      UpdateExpression: 'set #act = :status',
      ExpressionAttributeNames: {
        '#act': 'active'
      },
      ExpressionAttributeValues: {
        ':status': status
      },
      ReturnValues: 'UPDATED_NEW'
    }
    return new Promise((resolve, reject) => {
      docClient.update(params, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }
}
export default new StudentsDAO()
