const express = require('express')
const map = require('lodash/map')
const filter = require('lodash/filter')
const url = require('url')
const uuidV4 = require('uuid/v4')

const router = express.Router()

import StatisticsDAO from '../DAO/StatisticsDAO'
import ExportService from '../../Export/Service/ExportService'

router.get('/export', function(req, res) {
  const ids = url.parse(req.query.ids).href.split(',')
  const type = url.parse(req.query.type).href
  StatisticsDAO.getStatisticsByUserId(ids.toString())
    .then(statistic => {
      const options = {
        name: `export_activities_${uuidV4()}`
      }

      return ExportService.export(statistic.Items, options, type.toString())
    })
    .then(({ fileName, filePath }) => {
      ExportService.serve(fileName, filePath, res)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/', function(req, res) {
  StatisticsDAO.getStatistics()
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})
router.get('/:userId', function(req, res) {
  StatisticsDAO.getStatisticsByUserId(req.params.userId)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/', function(req, res) {
  StatisticsDAO.createStatistic(req.body)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.delete('/:id', function(req, res) {
  StatisticsDAO.deleteStatistic(req.params.id)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/:id', function(req, res) {
  StatisticsDAO.updateLesson(req.params.id, req.body)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

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
