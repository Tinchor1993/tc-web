import path from "path"
import fs from "fs-extra"
import moment from "moment"
const uuidV4 = require("uuid/v4")

const uploadPath = path.resolve(__dirname, "../../tmp")
const generateUploadPath = fileName => path.join(uploadPath, fileName)

const audioFormats = [".mp3", ".wav"]
const videoFormats = [".avi", ".mpeg", ".mp4", ".webm"]
const imageFormats = [".jpeg", ".png", ".jpg", ".gif"]

const readFile = filePath =>
  new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      console.log("read file", filePath)
      console.log(err)
      if (err) return rej(err)

      return res(data)
    })
  })

const getPrettyFilename = filename => {
  const subStrForDelete = filename.slice(0, 13)
  return filename.replace(subStrForDelete, "")
}

const getFileFormat = file => {
  const dot = file.lastIndexOf(".")
  const format = file.substring(dot)
  if (audioFormats.indexOf(format) !== -1) {
    return "music"
  }
  if (videoFormats.indexOf(format) !== -1) {
    return "video"
  }
  if (imageFormats.indexOf(format) !== -1) {
    return "image"
  }
  return "other"
}

export default ({ config, db, s3 }) => ({
  getAll() {
    const params = {
      TableName: config.tables.files
    }

    return db
      .scan(params)
      .promise()
      .then(data => data.Items)
  },
  getFilesByType(type) {
    const params = {
      TableName: config.tables.files,
      FilterExpression: "#filetype = :filetype",
      ExpressionAttributeNames: {
        "#filetype": "type"
      },
      ExpressionAttributeValues: {
        ":filetype": type
      }
    }

    return db
      .scan(params)
      .promise()
      .then(data => data.Items)
  },
  findByName(name) {
    let regex = new RegExp("^.*" + name + ".*$", "i")

    return this.getAll().then(items =>
      items.filter(value => regex.test(value.pretty.toLowerCase()))
    )
  },
  createElement({ filename, url }) {
    const idOfNewElement = uuidV4()
    const timeCreated = moment().unix()

    let params = {
      TableName: config.tables.files,
      Item: {
        id: idOfNewElement,
        Key: filename,
        pretty: getPrettyFilename(filename),
        url: url,
        creationDate: timeCreated,
        type: getFileFormat(filename)
      }
    }

    return db.put(params).promise()
  },
  upload(fileName, folder) {
    const filePath = generateUploadPath(fileName)

    return readFile(filePath)
      .then(data => {
        let base64data = new Buffer(data, "binary")
        const key =
          folder === undefined
            ? fileName.toString()
            : folder.toString() + "/" + fileName.toString()

        const url =
          folder === undefined
            ? `${config.bucket.images.publicPath}/${fileName}`
            : `${config.bucket.images.publicPath}/${folder}/${fileName}`

        const params = {
          Bucket: `${config.bucket.images.name}`,
          Key: key,
          Body: base64data,
          ACL: "public-read"
        }

        return s3
          .putObject(params)
          .promise()
          .then(() => url)
          .catch(err => {
            console.error(err)
          })
      })
      .then(async url => {
        const uploadPath = generateUploadPath(fileName)
        fs.removeSync(uploadPath)

        const subStrForDelete = fileName.slice(0, 13)
        const pretty = fileName.replace(subStrForDelete, "")
        if (folder === undefined) {
          await this.createElement({
            url: url,
            filename: fileName
          })
        }

        return {
          url: url,
          filename: fileName,
          pretty: pretty
        }
      })
  },
  getFolders() {}
})
