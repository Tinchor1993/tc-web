const express = require('express')
const router = express.Router()
import StandardsDAO from '../DAO/StandardsDAO'

router.get('/', function(req, res) {
  const size = req.query.size || 9999
  const id = req.query.id || undefined
  const creationDate = req.query.creationDate || undefined
  const status = req.query.status || undefined
  StandardsDAO.getStandards(size, id, creationDate, status)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/', function(req, res) {
  StandardsDAO.createStandard(req.body)
    .then(data => {
      StandardsDAO.getStandardById(data).then(data => {
        res.send(data.Items[0])
      })
    })
    .catch(err => {
      res.send(err)
    })
})

router.delete('/:id', function(req, res) {
  const creationDate = req.query.creationDate
  StandardsDAO.deleteStandard(req.params.id, creationDate)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:id', function(req, res) {
  StandardsDAO.getElementById(req.params.id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/:id', function(req, res) {
  StandardsDAO.updateStandardById(req.body, req.params.id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
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
