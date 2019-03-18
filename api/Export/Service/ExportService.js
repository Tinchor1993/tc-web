const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const jsonexport = require('jsonexport')
const json2html = require('node-json2html')
const htmlPdf = require('html-pdf')
const transform = {
  '<>': 'li',
  html: '${id} - ${fullName} - ${email} - ${status}  -${answerId}'
}

const config = require('../../../config.json')
const TEMP_FOLDER_PATH = path.resolve(__dirname + '/../../../' + config.temp)

export const CSV = 'csv'
export const PDF = 'pdf'

class ExportService {
  serve(fileName, filePath, res) {
    fs.readFile(filePath, function(error, file) {
      if (error) {
        res.send(error)
      } else {
        res.writeHead(200, {
          'Content-Disposition': `attachment; filename=${fileName}`,
          'Content-Transfer-Encoding': 'binary',
          'Content-Type': 'application/octet-stream'
        })
        res.write(file)

        res.end()
      }
    })
  }

  export(data, options, type) {
    switch (type) {
      case CSV:
        return this.exportCSV(data, options)

      case PDF:
        return this.exportPDF(data, options)

      default:
        return Promise.reject(Error('Unsupported export type'))
    }
  }

  jsToCsv(data) {
    return new Promise((res, rej) => {
      jsonexport(data, function(err, csv) {
        if (err) {
          rej(err)
        }

        res(csv)
      })
    })
  }

  jsToPdf(data) {
    return new Promise((res, rej) => {
      res(json2html.transform(data, transform))
    })
  }

  exportCSV(data, name) {
    const fileName = `${name}.csv`
    const filePath = path.join(TEMP_FOLDER_PATH, fileName)

    return this.jsToCsv(data).then(csv => {
      fse.outputFileSync(filePath, csv)
      return { fileName, filePath }
    })
  }

  exportPDF(data, name) {
    const fileName = `${name}.pdf`
    const filePath = path.join(TEMP_FOLDER_PATH, fileName)
    return this.jsToPdf(data)
      .then(html => {
        return new Promise((res, rej) => {
          htmlPdf.create(html).toFile(filePath, (err, data) => {
            if (err) rej(err)
            res(data)
          })
        })
      })
      .then(() => {
        return { fileName, filePath }
      })
  }
}

export default new ExportService()
