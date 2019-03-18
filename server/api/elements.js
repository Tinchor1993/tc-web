import { Router } from "express"
import elementModel from "../models/elements"
import lodash from "lodash"
import defaultElement from "../../shared/defaultElement"
import {isLogicalEmpty} from "../utils";

const NEW_FOLDER = "new"
const EXISTING_FOLDER = "exists"

export default context => {
  const router = Router({})
  const elements = elementModel(context)

  const normalize = data => {
    return lodash.defaultsDeep({}, data, defaultElement)
  }

  const getFullElement = id => {
    return elements.getById(id).then(element => {
      const { folderId } = element
      if (isLogicalEmpty(folderId)) return element

      return elements.getFolderById(folderId).then(folder => {
        element.folder = {
          id: folder.id,
          label: folder.title,
          data: folder
        }

        return element
      })
    })
  }

  const getFolder = ({ folderType, newFolderName, folder = {} }) => {
    if (folderType === NEW_FOLDER) {
      return elements.createFolder({
        title: newFolderName
      })
    } else {
      return Promise.resolve(folder.id)
    }
  }

  router.get("/", (req, res) => {
    const { size = 9999, id, creationDate, status } = req.query

    return elements
      .getAll(size, id, creationDate, status)
      .then(subjects => res.send(subjects))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.post("/", async (req, res) => {
    const data = await normalize(req.body)
    data.folderId = await getFolder(req.body)
    delete data.folderType
    delete data.newFolderName
    
    return elements
      .create(data)
      .then(id => getFullElement(id))
      .then(element => res.send(element))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/folders", (req, res) => {
    return elements
      .getFolders()
      .then(folders => res.send(folders))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/folders/:id", (req, res) => {
    const { id } = req.params
    return elements
      .getElementbyFolderId(id)
      .then(folder => res.send(folder))
      .catch(error => res.send({ success: false, error: error.message }))
  })
  
  router.delete("/folders/delete/:id", (req, res) => {
    const { id } = req.params
    const { creationDate } = req.query

    return elements
      .deleteFolder(id, creationDate)
      .then(folder => res.send(folder))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/:id", (req, res) => {
    const { id } = req.params

    return getFullElement(id)
      .then(element => res.send(element))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.put("/:id", async (req, res) => {
    const { id } = req.params
    const data = await normalize(req.body)

    return elements
      .update(id, data)
      .then(id => elements.getElementById(id))
      .then(lesson => res.send(lesson))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.delete("/:id", (req, res) => {
    const { id } = req.params
    const { creationDate } = req.query

    return elements
      .deleteById(id, creationDate)
      .then(() => res.send({ success: true }))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  return router
}
