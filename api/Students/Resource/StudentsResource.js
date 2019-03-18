const express = require('express')
const router = express.Router()
const fs = require('fs-extra')
const uuidV4 = require('uuid/v4')
import StudentsDAO from '../DAO/StudentsDAO'
import ExportService from '../../Export/Service/ExportService'

router.post('/invite', function (req, res) {
  StudentsDAO.getStudentByEmail(req.body.email).then(data => {
    if (data.count !== 0) {
      return res.send("It's already exists")
    } else {
      let expires
      let accessToken
      StudentsDAO.getAccessToken().then(data => {
        console.log(data)
        expires = data.expires
        accessToken = data.accessToken

        StudentsDAO.registerStudents(
          req.body.name,
          req.body.surname,
          req.body.email
        ).then(data => {
          StudentsDAO.inviteStudent(
            req.body.name,
            req.body.surname,
            req.body.email,
            data.id,
            data.creationDate,
            accessToken,
            expires
          )
            .then(data => {
              res.send(data)
            })
            .catch(err => {
              if (err.code === '23503') res.sendStatus(404)
              else res.send(err)
            })
        })
      })
    }
  })
})

router.get('/', function (req, res) {
  StudentsDAO.getStudents()
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/filter', function (req, res) {
  const fullName = req.query.q
  const size = req.query.size || 9999
  const id = req.query.id || undefined
  const creationDate = req.query.creationDate || undefined
  const status = req.query.status || undefined
  let globalData = []
  StudentsDAO.searchByFullName(
    fullName,
    size,
    id,
    creationDate,
    status,
    0,
    globalData
  )
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:id/activate/:creationDate', function (req, res) {
  StudentsDAO.changeStatus(req.params.id, true, req.params.creationDate)
    .then(data => {
      res.send('ok')
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:id/deactivate/:creationDate', function (req, res) {
  StudentsDAO.changeStatus(req.params.id, false, req.params.creationDate)
    .then(data => {
      res.send('ok')
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/export', function (req, res) {
  const type = req.query.type
  const name = uuidV4() + 'students'
  ExportService.export(req.body, name, type)
    .then(data => {
      res.sendFile(data.filePath)
      fs.remove(data.filePath)
    })
    .catch(err => {
      res.send(err)
    })
})

module.exports = router
