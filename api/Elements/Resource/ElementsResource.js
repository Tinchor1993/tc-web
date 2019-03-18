const express = require('express')
const router = express.Router()
import ElementsDAO from '../DAO/ElementsDAO'
import ElementTypesDAO from '../DAO/ElementTypesDAO'
import ElementFoldersDAO from '../DAO/ElementFoldersDAO'
import pretty from '../../Helpers/pretty'

/**
 * ElementTypes
 */
router.get('/types', function(req, res) {
  ElementTypesDAO.getElementTypes()
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/types/filter', function(req, res) {
  ElementTypesDAO.getElementTypesByName(req.query.q)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/types', function(req, res) {
  ElementTypesDAO.createElementType(req.body)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.delete('/types/:id', function(req, res) {
  ElementTypesDAO.deleteElementType(req.params.id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/types/:id', function(req, res) {
  ElementTypesDAO.updateElementType(req.params.id, req.body)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

/**
 * Folders
 */
router.get('/folders', function(req, res) {
  ElementFoldersDAO.getFolders()
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/folders/:folderId/', function(req, res) {
  ElementsDAO.getElementsByFolderId(req.params.folderId)
    .then(data => {
      data.Items = pretty(data.Items)
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/folders', function(req, res) {
  ElementFoldersDAO.createFolderElement(req.body)
    .then(data => {
      console.dir(data)
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.delete('/folders/:id', function(req, res) {
  ElementFoldersDAO.deleteFolder(req.params.id)
    .then(data => {
      ElementsDAO.getElementsByFolderId(req.params.id).then(data => {
        const size = data.Items.length
        let count = 0
        data.Items.forEach(function(item) {
          ElementsDAO.unpinElementFromFolder(item.id, item.creationDate).then(
            () => {
              count++
              if (count === size) {
                res.send('ok')
              }
            }
          )
        })
      })
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/types/:id', function(req, res) {
  ElementFoldersDAO.updateFolder(req.params.id, req.body)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

/**
 * Elements
 */
router.get('/', function(req, res) {
  const size = req.query.size || 9999
  const id = req.query.id || undefined
  const creationDate = req.query.creationDate || undefined
  const status = req.query.status || undefined
  ElementsDAO.getElements(size, id, creationDate, status)
    .then(data => {
      data.Items = pretty(data.Items)
      res.send(data.Items)
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
  ElementsDAO.getElementsByName(
    name,
    size,
    id,
    creationDate,
    status,
    0,
    globalData
  )
    .then(data => {
      data.forEach(function(item) {
        ElementTypesDAO.getElementTypeById(item.type).then(data => {
          item.type = data
        })
      })

      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/', function(req, res) {
  let new_element = req.body
  if (new_element.folderType && new_element.folderType === 'new') {
    let folder = {}
    folder.label = new_element.newFolderName || 'New Folder'
    ElementFoldersDAO.createFolderElement(folder).then(new_folder => {
      new_element.folder = new_folder.id
      delete new_element.folderType
      delete new_element.newFolderName
      ElementsDAO.createElement(new_element)
        .then(data => {
          ElementsDAO.getElementById(data).then(data => {
            res.send(data.Items[0])
          })
        })
        .catch(err => {
          res.send(err)
        })
    })
  } else {
    ElementsDAO.createElement(req.body)
      .then(data => {
        ElementsDAO.getElementById(data).then(data => {
          res.send(data.Items[0])
        })
      })
      .catch(err => {
        res.send(err)
      })
  }
})

router.delete('/:id', function(req, res) {
  const creationDate = req.query.creationDate
  ElementsDAO.deleteElement(req.params.id, creationDate)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:id', function(req, res) {
  let element
  ElementsDAO.getElementById(req.params.id)
    .then(data => {
      element = data.Items[0]

      if (element.folderId !== 'null') {
        ElementFoldersDAO.getFolderById(element.folderId).then(data => {
          element.folder = {}
          element.folder.label = data.title
          element.folder.value = data.id
          element.folderType = 'exist'
          if (element.type !== 'null') {
            ElementTypesDAO.getElementTypeById(element.type).then(data => {
              element.type = {}
              element.type.label = data.Items[0].type
              element.type.value = data.Items[0].id
              element = pretty(element)
              res.send(element)
            })
          } else {
            res.send(element)
          }
        })
      } else {
        if (element.type !== 'null') {
          ElementTypesDAO.getElementTypeById(element.type).then(data => {
            element.type = {}
            element.folderType = 'exist'
            element.type.label = data.Items[0].type
            element.type.value = data.Items[0].id
            element = pretty(element)
            res.send(element)
          })
        } else {
          element = pretty(element)
          res.send(element)
        }
      }
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/:id', function(req, res) {
  let new_element = req.body
  if (new_element.folderType && new_element.folderType === 'new') {
    let folder = {}
    folder.label = new_element.newFolderName || 'New Folder'
    ElementFoldersDAO.createFolderElement(folder).then(new_folder => {
      new_element.folder = new_folder.id
      delete new_element.folderType
      delete new_element.newFolderName
      ElementsDAO.updateElement(new_element, req.params.id)
        .then(data => {
          res.send(data)
        })
        .catch(err => {
          res.send(err)
        })
    })
  } else {
    ElementsDAO.updateElement(req.body, req.params.id)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.send(err)
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
