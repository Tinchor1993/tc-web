let AWS = require('aws-sdk'),
  fs = require('fs')

const uuidV4 = require('uuid/v4')

const config = require('../../../config.json')
let tablename = `${config.tablename.table_statistics}`

let docClient = new AWS.DynamoDB.DocumentClient()

class StatisticsDAO {
  createStatistic(data) {
    let params = {
      TableName: tablename,
      Item: {
        id: uuidV4(),
        answerId: data.answerId,
        correct: data.correct,
        date: data.date,
        questionId: data.questionId,
        userId: data.userId
      }
    }

    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }

  getStatistics() {
    let params = {
      TableName: tablename
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

  getStatisticsByUserId(userId) {
    let params = {
      TableName: tablename,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'userId'
      },
      ExpressionAttributeValues: {
        ':idd': userId
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

  deleteStatistic(id) {
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

  /*updateStatistic(data, id){

    let params = {
      TableName:"thinking_capp_statistics",
      Key:{
        "id": id
      },
      UpdateExpression: "set #n = :val, description = :val2",
      ExpressionAttributeNames:{
        "#n" : "name"
      },
      ExpressionAttributeValues:{
        ":val": data.name,
        ":val2": data.description
      },
      ReturnValues:"UPDATED_NEW"
    };


    return new Promise((resolve, reject) => {
      docClient.update(params, function (err, data) {
        if (err) {

          return reject(err);
        } else {

          return resolve(data);
        }
      });
    });

  }*/
}

export default new StatisticsDAO()
