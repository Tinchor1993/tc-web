const express = require('express')
const multer = require('multer')

const path = require('path')

const router = express.Router()

import UploadDAO from '../DAO/UploadDAO'

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    const dest = path.join(__dirname, '..', '..', '..', 'tmp')
    callback(null, dest)
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname.replace(/[^\.\w]/gi, ''))
  }
})

const upload = multer({ storage: storage }).any()
router.post('/', function(req, res) {
  console.log('upload start')
  const folder = req.query.folder || undefined
  upload(req, res, function(err) {
    if (err) {
      return res.send(err)
    } else {
      const filename = req.files[0].filename.replace('/[^.w]/gi', '')
      return UploadDAO.uploadFile(res, filename, folder)
    }
  })
})

/**
 * Error Handle
 */
router.get('*', function(req, res) {
  res.sendStatus(404)
})
router.post('*', function(req, res) {
  res.sendStatus(404)
})
router.put('*', function(req, res) {
  res.sendStatus(404)
})
router.delete('*', function(req, res) {
  res.sendStatus(404)
})

module.exports = router
