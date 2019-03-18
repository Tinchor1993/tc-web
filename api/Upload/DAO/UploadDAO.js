const AWS = require('aws-sdk'),
  path = require('path'),
  fs = require('fs-extra')

const s3 = new AWS.S3()

import FilesDAO from '../../Files/DAO/FilesDAO'
const config = require('../../../config.json')
const uploadPath = path.join(__dirname, '../../../tmp')

const generateUploadPath = fileName => path.join(uploadPath, fileName)

class UploadDAO {
  uploadFile(res, fileName, folder) {
    fs.readFile(generateUploadPath(fileName), function(err, data) {
      if (err) {
        res.send({
          success: false,
          err
        })
      }

      let base64data = new Buffer(data, 'binary')
      const key =
        folder === undefined
          ? fileName.toString()
          : folder.toString() + '/' + fileName.toString()
      const url =
        folder === undefined
          ? `https://tca-image-uploads.s3.amazonaws.com/${fileName}`
          : `https://tca-image-uploads.s3.amazonaws.com/${folder}/${fileName}`
      s3.putObject(
        {
          Bucket: `${config.bucket.bucketName}`,
          Key: key,
          Body: base64data,
          ACL: 'public-read'
        },
        function(err, data) {
          fs.remove(generateUploadPath(fileName), function(err) {
            if (err) {
              res.send(err)
            } else {
              const subStrForDelete = fileName.slice(0, 13)
              const pretty = fileName.replace(subStrForDelete, '')
              if (folder === undefined) {
                FilesDAO.createElement({
                  url: url,
                  filename: fileName
                })
              }
              console.log(url, fileName, pretty)
              res.send({
                success: true,
                url: url,
                filename: fileName,
                pretty: pretty
              })
            }
          })
        }
      )
    })
  }
}

export default new UploadDAO()
