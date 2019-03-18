const AWS = require('aws-sdk')
let s3 = new AWS.S3()

const uuidV4 = require('uuid/v4')
const moment = require('moment')
const config = require('../../../config.json')
const lodash = require('lodash')

const audioFormats = ['.mp3', '.wav']
const videoFormats = ['.avi', '.mpeg', '.mp4', '.webm']
const imageFormats = ['.jpeg', '.png', '.jpg', '.gif']

let tableFiles = `${config.tablename.table_files}`
let docClient = new AWS.DynamoDB.DocumentClient()

class FilesDAO {
  createElement(data) {
    const idOfNewElement = uuidV4()
    const timeCreated = moment().unix()
    let params = {
      TableName: tableFiles,
      Item: {
        id: idOfNewElement,
        Key: data.filename,
        pretty: this.getPrettyFilename(data.filename),
        url: data.url,
        creationDate: timeCreated,
        type: this.getFormat(data.filename)
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

  getPrettyFilename(filename) {
    const subStrForDelete = filename.slice(0, 13)
    return filename.replace(subStrForDelete, '')
  }

  findByName(name) {
    const params = {
      TableName: tableFiles
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          let regex = new RegExp('^.*' + name + '.*$', 'i')
          return resolve(
            data.Items.filter(value => regex.test(value.pretty.toLowerCase()))
          )
        }
      })
    })
  }

  getFormat(filename) {
    const dot = filename.lastIndexOf('.')
    const format = filename.substring(dot)
    if (audioFormats.indexOf(format) !== -1) {
      return 'music'
    }
    if (videoFormats.indexOf(format) !== -1) {
      return 'video'
    }
    if (imageFormats.indexOf(format) !== -1) {
      return 'image'
    }
    return 'other'
  }

  loadPagedFilteredFiles(marker, prefix, size) {
    let params = {
      Bucket: `${config.bucket.bucketName}`,
      Prefix: prefix,
      MaxKeys: size
    }

    if (marker !== null) {
      params.Marker = marker.toString()
    }

    return new Promise((resolve, reject) => {
      s3.listObjects(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        return resolve(data)
      })
    })
  }

  loadPagedFiles(marker, size) {
    let params = {
      Bucket: `${config.bucket.bucketName}`,
      MaxKeys: size
    }
    return new Promise((resolve, reject) => {
      if (marker !== null) {
        params.Marker = marker.toString()
      }

      s3.listObjects(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        return resolve(data)
      })
    })
  }

  listAll(marker, allData) {
    return new Promise((resolve, reject) => {
      s3.listObjects(
        { Bucket: `${config.bucket.bucketName}`, Marker: marker },
        function(err, data) {
          allData.push(data.Contents)
          if (data.IsTruncated) resolve(listAllKeys(data.NextMarker, allData))
          else return resolve(allData)
        }
      )
    })
  }

  bubbleSort(arr) {
    return new Promise((resolve, reject) => {
      let len = arr.length
      for (let i = len - 1; i >= 0; i--) {
        for (let j = 1; j <= i; j++) {
          if (
            arr[j - 1].LastModified.getTime() < arr[j].LastModified.getTime()
          ) {
            let temp = arr[j - 1]
            arr[j - 1] = arr[j]
            arr[j] = temp
          }
        }
      }
      return resolve(arr)
    })
  }

  filterFiles(data, filter) {
    const size = data.length
    let count = 0
    data = data[0]
    let results = []
    return new Promise((resolve, reject) => {
      data.forEach(function(item) {
        if (item.Key.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
          const index = data.indexOf(item)
          results.push(data[index])
        }
        count++
        if (count === size) resolve(results)
      })
    })
  }

  getFolders(data) {
    const size = data.length
    let count = 0
    let results = []
    return new Promise((resolve, reject) => {
      data.forEach(function(item) {
        if (item.Key.indexOf('/') !== -1) {
          const index = data.indexOf(item)
          let file = data[index]
          file.Key = file.Key.substring(0, file.Key.indexOf('/'))
          if (results.indexOf(file.Key) === -1) {
            results.push(file.Key)
          }
        }
        count++
        if (count === size) resolve(results)
      })
    })
  }

  getAll() {
    const params = {
      TableName: tableFiles
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data.Items)
        }
      })
    })
  }

  getFilesByType(type) {
    const params = {
      TableName: tableFiles,
      FilterExpression: '#filetype = :filetype',
      ExpressionAttributeNames: {
        '#filetype': 'type'
      },
      ExpressionAttributeValues: {
        ':filetype': type
      }
    }
    return new Promise((resolve, reject) => {
      docClient.scan(params, function(err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data.Items)
        }
      })
    })
  }
}

export default new FilesDAO()
