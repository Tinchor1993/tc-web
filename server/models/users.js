export default ({ config, db }) => ({
  updateStudentGoogleId(id, creationDate, googleId) {
    const params = {
      TableName: config.tables.students,
      Key: {
        id: id.toString(),
        creationDate: Number(creationDate)
      },
      UpdateExpression: "set googleId = :googleId",
      ExpressionAttributeValues: {
        ":googleId": googleId
      }
    }
    
    return db
      .update(params)
      .promise()
      .then(data => data.Items)
  },
  loginUser(login, password) {
    let params = {
      TableName: config.tables.users,
      FilterExpression: "#login = :login and #pswd = :password",
      ExpressionAttributeNames: {
        "#pswd": "password",
        "#login": "login"
      },
      ExpressionAttributeValues: {
        ":login": login,
        ":password": password
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => {
        if (data.Count === 0) {
          throw new Error("User not found")
        }

        return data.Items[0]
      })
  },
  isInvited(email) {
    const params = {
      TableName: config.tables.students,
      FilterExpression: "#mail = :email and #act = :bool",
      ExpressionAttributeNames: {
        "#mail": "email",
        "#act": "active"
      },
      ExpressionAttributeValues: {
        ":email": email,
        ":bool": true
      }
    }
    
    return db
      .scan(params)
      .promise()
      .then(data => {
        let response = {}

        if (data.Items.length > 0) {
          response.bool = true
          response.id = data.Items[0].id
          response.creationDate = data.Items[0].creationDate
        } else {
          response.bool = false
        }
        
        return response
      })
  }
})
