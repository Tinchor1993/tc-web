import { Router } from "express"
import subjectModel from "../models/subjects"
import lessonModel from "../models/lessons"

export default ({ config, db }) => {
  const router = Router()
  const subjects = subjectModel({ config, db })
  const lessons = lessonModel({ config, db })

  router.get("/", async (req, res) => {
    const { size = 9999, id, creationDate, status } = req.query

    return subjects
      .getAll(size, id, creationDate, status)
      .then(async items => {
        const counts = await Promise.all(
          items.map(subject => subjects.getLessonsBySubjectId(subject.id))
        )
        
        items = items.map((item, index) => {
          item.quantity = counts[index].length || 0
          return item
        })
        
        res.send(items)
      })
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/filter", (req, res) => {
    const { q, size = 9999, id, creationDate, status } = req.query

    let total = 0
    let globalData = []
    return subjects
      .getSubjectByName(q, size, id, creationDate, status, total, globalData)
      .then(subjects => res.send(subjects))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.post("/", (req, res) => {
    const data = req.body

    return subjects
      .create(data)
      .then(id => subjects.getById(id))
      .then(subject => res.send(subject))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/:id", (req, res) => {
    const { id } = req.params
    
    return subjects
      .getById(id)
      .then(async subject => {
        const lessons = await subjects.getLessonsBySubjectId(id)
        
        res.send({
          ...subject,
          lessons
        })
      })
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.put("/:id", (req, res) => {
    const { id } = req.params
    const data = req.body
    delete data.id

    return subjects
      .updateById(id, data)
      .then(() => subjects.getById(id))
      .then(subject => res.send(subject))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.delete("/:id", (req, res) => {
    const { id } = req.params
    const { creationDate } = req.query

    return subjects
      .removeById(id, creationDate)
      .then(() => res.send({ success: true }))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  return router
}
