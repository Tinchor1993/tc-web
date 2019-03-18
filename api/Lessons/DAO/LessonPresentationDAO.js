let AWS = require('aws-sdk'),
  fs = require('fs')
const uuidV4 = require('uuid/v4')

const docClient = new AWS.DynamoDB.DocumentClient()
const config = require('../../../config.json')
const tablename = `${config.tablename.table_presentations}`
const tablename_slides = `${config.tablename.table_slides}`

class LessonsPresentationDAO {
  createLessonPresentations(data, lessonId) {
    const idOfNewElement = uuidV4()

    let params = {
      TableName: tablename,
      Item: {
        id: idOfNewElement,
        lessonId: lessonId
      }
    }

    return new Promise((resolve, reject) => {
      docClient.put(params, (err, dataa) => {
        if (err) {
          return reject(err)
        } else {
          for (let i = 0; i < data.slides.length; i++)
            this.createSlide(idOfNewElement, data.slides[i])
          return resolve(idOfNewElement)
        }
      })
    })
  }

  createSlide(lessonId, data) {
    const idOfNewElement = uuidV4()
    let params = {
      TableName: tablename_slides,
      Item: {
        id: idOfNewElement,
        lessonId: lessonId,
        type: data.type,
        text: data.text,
        media: data.media,
        settings: data.settings
      }
    }

    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(presentationId)
        }
      })
    })
  }

  deleteSlide(id) {
    let params = {
      TableName: tablename_slides,
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

  updateLessonPresentations(id, data) {
    let params = {
      TableName: tablename,
      Key: {
        id: id
      },
      UpdateExpression: 'set lessonId = :lessonIdd',
      ExpressionAttributeValues: {
        ':lessonIdd': data.lessonId
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

  updateSlide(slideId) {
    let params = {
      TableName: tablename,
      Key: {
        id: id
      },
      UpdateExpression: 'set lessonId = :lessonIdd',
      ExpressionAttributeValues: {
        ':lessonIdd': data.lessonId
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
  deleteLessonPresentations(id) {
    let params = {
      TableName: tablename,
      Key: {
        id: id.toString()
      }
    }
    return new Promise((resolve, reject) => {
      if (id === undefined) return resolve('ok')
      docClient.delete(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      })
    })
  }

  getSlidesByLessonId(id) {
    let params = {
      TableName: tablename,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'lessonId'
      },
      ExpressionAttributeValues: {
        ':idd': id
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

  getSlideById(id) {
    let params = {
      TableName: tablename_slides,
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

  getPresentationById(presentationId) {
    let params = {
      TableName: tablename,
      KeyConditionExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'id'
      },
      ExpressionAttributeValues: {
        ':idd': presentationId
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

  getPresentationsByLessonId(id) {
    let params = {
      TableName: tablename,
      FilterExpression: '#idd = :idd',
      ExpressionAttributeNames: {
        '#idd': 'lessonId'
      },
      ExpressionAttributeValues: {
        ':idd': id
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data.Items[0])
        }
      })
    })
  }
}

export default new LessonsPresentationDAO()
