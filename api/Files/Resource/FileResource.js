const express = require('express')
const multer = require('multer')

const url = require('url')
const router = express.Router()

import FilesDAO from '../DAO/FilesDAO'

router.get('/music', function(req, res) {
  let size = req.query.size || 15
  let allData = []
  FilesDAO.getFilesByType('music')
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

/*
router.get('/migrate', function (req, res) {
  let size = 85;
  console.log(size);
  let allData = [];
  FilesDAO
    .listAll("", allData)
    .then(data => {
      console.log(data);
      data = data[0]
      FilesDAO
        .bubbleSort(data)
        .then(data => {
          for (let i = 0; i < size; i++) {
            if (data[i]) {
              FilesDAO.createElement({
                url: 'https://s3.amazonaws.com/thinking-capp-uploads/' + data[i].Key,
                filename: data[i].Key
              })
            }
          }
          res.send({status: true})
        })
    })

    .catch(err => {
      res.send(err);
    })
});
*/

router.get('/folders', function(req, res) {
  let size = req.query.size || 15
  let allData = []
  FilesDAO.listAll('', allData)
    .then(data => {
      data = data[0]
      FilesDAO.getFolders(data).then(data => {
        let finalResult = []
        for (let i = 0; i < size; i++) {
          finalResult.push(data[i])

          if (i + 1 === size || i + 1 === data.length) {
            return res.send(finalResult)
          }
        }
      })
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:name', function(req, res) {
  let allData = []
  let size = req.query.size || 15
  const filter = req.params.name
  FilesDAO.findByName(filter)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/', function(req, res) {
  let size = req.query.size || 15
  let allData = []
  FilesDAO.getAll()
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
