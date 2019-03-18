import { Router } from "express"
import model from "../models/files"
import multer from "multer"
import path from "path"

export default ({ config, db, s3 }) => {
  const router = Router()
  const files = model({ config, db, s3 })

  const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      const dest = path.resolve(__dirname, "../../tmp")
      callback(null, dest)
    },
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname.replace(/[^\.\w]/gi, ""))
    }
  })

  const upload = multer({ storage: storage }).any()

  router.post("/upload", (req, res) => {
    const { folder } = req.query

    upload(req, res, function(err) {
      if (err) {
        return res.send(err)
      } else {
        const filename = req.files[0].filename.replace("/[^.w]/gi", "")

        return files
          .upload(filename, folder)
          .then(fileData =>
            res.send({
              success: true,
              ...fileData
            })
          )
          .catch(error => res.send({ success: false, error: error.message }))
      }
    })
  })

  router.get("/", (req, res) => {
    const { size = 9999, id, creationDate, status } = req.query

    return files
      .getAll(size, id, creationDate, status)
      .then(files => res.send(files))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/music", (req, res) => {
    return files
      .getFilesByType("music")
      .then(files => res.send(files))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/folders", (req, res) => {
    return files
      .getFolders()
      .then(folders => res.send(folders))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/:name", (req, res) => {
    const { name } = req.params

    return files
      .findByName(name)
      .then(file => res.send(file))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  return router
}
