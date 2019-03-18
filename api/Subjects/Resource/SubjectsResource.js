const express = require('express')
const multer = require('multer')
const map = require('lodash/map')
const url = require('url')
const filter = require('lodash/filter')

const router = express.Router()

import SubjectsDAO from '../DAO/SubjectsDAO'
import pretty from '../../Helpers/pretty'

router.get('/lessons', function(req, res) {
  let subjects
  const size = req.query.size || 9999
  const id = req.query.id || undefined
  const creationDate = req.query.creationDate || undefined
  const status = req.query.status || undefined
  SubjectsDAO.getSubjects(size, id, creationDate, status)
    .then(data => {
      subjects = data
      let countPromises = data.Items.map(item => {
        return SubjectsDAO.getLessonsBySubjectId(item.id).then(data => {
          item.lessons = []
          data.Items.forEach(function(lesson) {
            const picked = (({ id, titleEn, preview }) => ({
              id,
              titleEn,
              preview
            }))(lesson)
            item.lessons.push(picked)
          })

          item.quantity = data.Count
          return item
        })
      })

      Promise.all(countPromises).then(counts => {
        counts = pretty(counts)
        res.send(counts)
      })
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/', function(req, res) {
  let subjects
  const size = req.query.size || 9999
  const id = req.query.id || undefined
  const creationDate = req.query.creationDate || undefined
  const status = req.query.status || undefined
  SubjectsDAO.getSubjects(size, id, creationDate, status)
    .then(data => {
      subjects = data
      let countPromises = data.Items.map(item => {
        return SubjectsDAO.getLessonsBySubjectId(item.id).then(data => {
          item.quantity = data.Count
          return item
        })
      })

      Promise.all(countPromises).then(counts => {
        counts = pretty(counts)
        res.send(counts)
      })
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/', function(req, res) {
  SubjectsDAO.createSubject(req.body)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/filter', function(req, res) {
  const name = req.query.q
  const size = req.query.size || 9999
  const id = req.query.id || undefined
  const creationDate = req.query.creationDate || undefined
  const status = req.query.status || undefined
  let globalData = []
  SubjectsDAO.getSubjectByName(
    name,
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

router.delete('/:id', function(req, res) {
  const creationDate = req.query.creationDate
  SubjectsDAO.deleteSubject(req.params.id, creationDate)
    .then(data => {
      res.send({
        success: true
      })
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:id', function(req, res) {
  let subject
  SubjectsDAO.getSubjectById(req.params.id)
    .then(data => {
      subject = data.Items[0]
      SubjectsDAO.getLessonsBySubjectId(subject.id).then(data => {
        subject.lessons = []
        data.Items.forEach(function(item) {
          const picked = (({ id, titleEn, creationDate, level }) => ({
            id,
            titleEn,
            creationDate,
            level
          }))(item)
          subject.lessons.push(picked)
        })

        subject.quantity = data.Count
        subject = pretty(subject)
        res.send(subject)
      })
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/:id', function(req, res) {
  const lessons = req.body.lessons
  const size = lessons.length
  let count = 0
  if (!size <= 0) {
    lessons.forEach(function(item) {
      console.dir(item)
      SubjectsDAO.appendLevelToLesson(item.id, item.creationDate, item.level)
        .then(() => {
          count++
          if (count === size) {
            SubjectsDAO.updateSubject(req.params.id, req.body).then(data => {
              res.send(data)
            })
          }
        })
        .catch(err => {
          res.send(err)
        })
    })
  } else {
    SubjectsDAO.updateSubject(req.params.id, req.body).then(data => {
      res.send(data)
    })
  }
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
