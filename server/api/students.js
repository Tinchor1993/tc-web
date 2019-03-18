import { Router } from "express"
import model from "../models/students"

export default ({ config, db }) => {
  const router = Router()
  const students = model({ config, db })

  router.get("/all", (req, res) => {
    const { size = 9999, id, creationDate, status } = req.query

    console.log('student id' + id)
    return students
      .getAll(size, id, creationDate, status)
      .then(subjects => res.send(subjects))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/invite/*", (req, res) => {
    const { size = 9999, id, creationDate, status } = req.query

    console.log('student id' + id)
    return res.send('Your account is activated successfully')
  })

  router.post("/invite", (req, res) => {
    const user = req.body
    
    return students
      .registerStudent(user)
      .then(data => res.send(data))
      .catch(err => res.status(500).send(err))
  })

  return router
}
