const express = require('express')
const map = require('lodash/map')
const filter = require('lodash/filter')
const lodash = require('lodash')

const router = express.Router()

import SubjectsDAO from '../../Subjects/DAO/SubjectsDAO'

router.put('/', function(req, res) {
  const size = req.body.length
  let count = 0
  req.body.forEach(function(item) {
    SubjectsDAO.appendLevelToLesson(
      item.id,
      item.creationDate,
      item.level
    ).then(data => {
      count++
      if (count === size) res.send('ok')
    })
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
