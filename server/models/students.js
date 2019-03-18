import moment from "moment"

const uuidV4 = require("uuid/v4")
const nodemailer = require("nodemailer")

export default ({ config, db }) => ({
  getAll(size, id, creationDate, status) {
    let params = {
      TableName: config.tables.students,
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
        data.Items.forEach(function (item) {
          delete item.status
          delete item.creationDate
          item.active = item.active ? "active" : "inactive"
        })

        return data.Items
      })
  },

  getById(studentId) {
    const params = {
      TableName: config.tables.students,
      FilterExpression: "#idd = :idd",
      ExpressionAttributeNames: {
        "#idd": "id"
      },
      ExpressionAttributeValues: {
        ":idd": studentId
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => {
        
        let studentdata = data.Items[0]
        if (!studentdata) {
          throw Error('student not found')
        }
        return studentdata
      })
  },

  updateAccessToken(token) {
    const params = {
      TableName: config.tables.token,
      Key: {
        id: "47151968-b471-4029-9e87-5f706b33da9a"
      },
      UpdateExpression: "set #acToken = :acToken, #expir = :exp",
      ExpressionAttributeNames: {
        "#acToken": "accessToken",
        "#expir": "expires"
      },
      ExpressionAttributeValues: {
        ":acToken": token.accessToken,
        ":exp": token.expires
      }
    }

    return db.update(params).promise()
  },

  getByEmail(email) {
    const params = {
      TableName: config.tables.students,
      FilterExpression: "#mail = :email",
      ExpressionAttributeNames: {
        "#mail": "email"
      },
      ExpressionAttributeValues: {
        ":email": email
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => {
        return data.Items[0]
      })
  },

  getStudentByGoogleId(googleId) {
    const params = {
      TableName: config.tables.students,
      FilterExpression: "googleId = :googleId",
      ExpressionAttributeValues: {
        ":googleId": googleId
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => {
        return data.Items[0]
      })
  },

  getAccessToken() {
    const params = {
      TableName: config.tables.token
    }

    return db
      .scan(params)
      .promise()
      .then(data => {
        return data.Items[0]
      })
  },

  registerStudents(name = "", surname = "", email = "") {
    const idOfNewElement = uuidV4()
    const creationDate = moment().unix()
    const params = {
      TableName: config.tables.students,
      Item: {
        id: idOfNewElement,
        fullName: name + " " + surname,
        lowerFullName: name.toLowerCase() + " " + surname.toLowerCase(),
        email: email,
        creationDate: creationDate,
        active: true,
        status: "OK"
      }
    }

    return db
          .put(params)
          .promise()
          .then(() => {
              return this.getByEmail(email)
          })
  },

  inviteStudent(name, surname, email, id, creationDate, accessToken, expires) {
    const isProduction = process.env.NODE_ENV === "dev"
    const URL = isProduction
      ? "http://localhost:8080/api/v1/students/invite/" +
      id +
      "/activate/" +
      creationDate
      : "http://tc.dataskeptic.com/api/v1/students/invite/" +
      id +
      "/activate/" +
      creationDate
    return new Promise((resolve, reject) => {
      let smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: 'matthewvg@gmail.com',
          clientId: '141978543542-53vgb42tv6qq3r7mb5ndg1m0a6hq6fg9.apps.googleusercontent.com',
          clientSecret: 'LgfAbcPKrUDDQBw8bLf8Fljf',
          refreshToken: '1/lCJI4ndlBGdFefmstXbvFMQAvzMVYB2G8NoSAeUScs4',
          accessToken: accessToken,
          expires: expires
        }
      })
      smtpTransport.on("token", token => {
        this.updateAccessToken(token)
      })
      let mailOptions = {
        from: "matthewvg@gmail.com",
        to: email,
        subject: "Thinking_capp",
        text:
          "Hello " +
          name +
          " " +
          surname +
          "\n" +
          "Welcome to Thinking Capp" +
          "\n" +
          URL
      }

      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log('sending invite email failed' + error)
          smtpTransport.close()
          reject(error)
        } else {
          console.log('sending invite email success' + response)
          smtpTransport.close()
          resolve(response)
        }
      })
    })
  },

  inviteStudentToLesson(fullName, email, lessonid) {
    const isProduction = process.env.NODE_ENV === "dev"
    const URL = isProduction
      ? "http://localhost:8080/games/" +
      lessonid
      : "http://tc.dataskeptic.com/games/" +
      lessonid

    console.log('invite url' + URL)
    return new Promise((resolve, reject) => {
      let smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: 'matthewvg@gmail.com',
          clientId: '141978543542-53vgb42tv6qq3r7mb5ndg1m0a6hq6fg9.apps.googleusercontent.com',
          clientSecret: 'LgfAbcPKrUDDQBw8bLf8Fljf',
          refreshToken: '1/lCJI4ndlBGdFefmstXbvFMQAvzMVYB2G8NoSAeUScs4',
          accessToken: '',
          expires: ''
        }
      })
      smtpTransport.on("token", token => {
        this.updateAccessToken(token)
      })
      let mailOptions = {
        from: "matthewvg@gmail.com",
        to: email,
        subject: "Thinking_capp",
        text:
          "Hello " +
          fullName +
          "\n" +
          "Welcome to Thinking Capp" +
          "\n" +
          URL
      }

      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log('sending email failed' + error)
          smtpTransport.close()
          reject(error)
        } else {
          console.log('sending email success' + response)
          smtpTransport.close()
          resolve(response)
        }
      })
    })
  },

  registerStudent(student) {
    if (!student.name || !student.surname || !student.email) {
      return { type: "new", id: undefined }
    }

    return this.getByEmail(student.email).then(existingStudent => {
      if (existingStudent) {
        return existingStudent
        console.log('existing student')
      }

      return this.getAccessToken().then(data => {
        const expires = data.expires
        const accessToken = data.accessToken

        console.log('accesstoken' + accessToken)
        return this.registerStudents(
          student.name,
          student.surname,
          student.email
        ).then(newStudent => {
          this.inviteStudent(
            student.name,
            student.surname,
            student.email,
            data.id,
            data.creationDate,
            accessToken,
            expires
          )

            return newStudent;
        })
      })
    })
  },

  fetchAndCreate(students) {
    return Promise.all(
      students.map(student => {
        if (student.id) return Promise.resolve(student)

        if (student.type === "new") {
          return Promise.resolve(this.registerStudent(student))
        }
      })
    )
  }


})
