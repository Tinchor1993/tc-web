import { Router } from "express"
import lodash from "lodash"
import lesssonModel from "../models/lessons"
import subjectModel from "../models/subjects"
import studentsModel from "../models/students"
import defaultLesson from "../../shared/defaultLesson"

export default ({ config, db }) => {
  const router = Router()
  const lessons = lesssonModel({ config, db })
  const subjects = subjectModel({ config, db })
  const students = studentsModel({ config, db })

  const getFullLesson = id => {
    return lessons.getById(id).then(lesson => {
      const { subjectId } = lesson
      return subjects
        .getById(subjectId)
        .then(subject => {
          lesson.subject = {
            value: subject.id,
            label: subject.titleEn
          }

          return lesson
        })
        .catch(() => {
          lesson.subject = null
          return lesson
        })
        .then(async data => {
          data.invite.students = (await Promise.all(
            data.invite.students.map(studentId => students.getById(studentId))
          )).filter(student => !!student)

          return data
        })
    })
  }

  const sendInviteStuduent = async (id, data) => {
    await Promise.all(
      data.map(async studentId => {
        console.log("student id" + JSON.stringify(studentId))
        let studentdata = await students.getById(studentId)
        console.log('student data')
        console.log(studentdata)
        console.log('end student data')
        if (studentdata.fullName != undefined && studentdata.email != undefined) {
          console.log('send student data')
          students.inviteStudentToLesson(
            studentdata.fullName,
            studentdata.email,
            id
          ).then(data => {

          })
            .catch(err => {
            })
        }

      })
    )
    return id
  }
  const normalize = async reqLesson => {
    let data = lodash.defaultsDeep({}, reqLesson, defaultLesson)

    if (data.sorting.backgroundMusic === undefined) {
      data.sorting.backgroundMusic = {}
    }
    if (data.quiz.questions === undefined) {
      data.quiz.questions = []
    }
    data.quiz.questions.map(question => {
      if (question.backgroundMusic === undefined) {
        question.backgroundMusic = {}
      }
    })
    if (data.presentation.backgroundMusic === undefined) {
      data.presentation.backgroundMusic = {}
    }
    data.sorting.elements.forEach(function (item) {
      // delete item.creationDate
      // delete item.objectivesEn
      // delete item.objectivesEs
      // delete item.media
      // delete item.titleEn
      // delete item.titleEs
      // delete item.type
      if (item.isCorrect !== true && item.isCorrect !== false) {
        item.isCorrect = false
      }
    })

    if (data.sorting.pipe === undefined) {
      data.sorting.pipe = null
    }

    if (data.sorting.pipePosition === undefined) {
      data.sorting.pipePosition = "top"
    }

    if (data.sorting.result === undefined) {
      data.sorting.result = {}
      data.sorting.result.win = {}
      data.sorting.result.fail = {}
    }

    data.invite.students = (await students.fetchAndCreate(data.invite.students))
      .filter(student => student && student.id)
      .map(student => student.id)

    if (data.subject && data.subject.value) {
      data.subject = data.subject.value
    }

    return data
  }

  router.get("/", (req, res) => {
    const { size = 9999, id, creationDate, status } = req.query

    return lessons
      .getAll(size, id, creationDate, status)
      .then(lessons => res.send(lessons))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.get("/gameSelector", (req, res) => {
    if (!req.user || !req.user.id) {
      res.send([])
    }

    students
      .getStudentByGoogleId(req.user.id)
      .then(student => {
        const googleUserId = student.id
        return lessons.getStudentLessons(googleUserId)
      })
      .then(data => {
        let lessonsList = data.Items
        if (!lessonsList.length) {
          res.send([])
        }
        lessonsList.map(async (lesson, index) => {
          lesson.isPlayed = await lessons
            .isPlayedByCurrentUser(req.user.id, lesson.id)
            .then(bool => bool)
          delete lesson.sorting
          delete lesson.presentation
          delete lesson.quiz
          delete lesson.ordering
          if (index === data.Items.length - 1) {
            res.send(lessonsList)
          }
        })
      })
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.post("/", async (req, res) => {

    const data = await normalize(req.body)
    console.log('edit lesson' + JSON.stringify(req.body.invite.students))
    console.log('edit lesson after' + JSON.stringify(data.invite.students))
    return lessons
      .create(data)
      .then(id => sendInviteStuduent(id, data.invite.students))
      .then(id => getFullLesson(id))
      .then(lesson => res.send(lesson))
      .catch(error => {
        console.error(error)
        return res.send({ success: false, error: error.message })
      })
  })

  router.get("/:id", (req, res) => {
    const { id } = req.params

    return getFullLesson(id)
      .then(lesson => {
        res.send(lesson)
      })
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.put("/:id", async (req, res) => {
    const { id } = req.params
    let data = req.body
    data = await normalize(data)
    console.log('edit lesson' + JSON.stringify(req.body.invite.students))
    console.log('edit lesson after' + JSON.stringify(data.invite.students))
    await Promise.all(

      req.body.invite.students.map(async student => {

        if (student.type == "new") {
          students.inviteStudentToLesson(
            student.name + student.surname,
            student.email,
            req.params.id
          ).then(data => {
          })
            .catch(err => {
            })
        }else {
          let studentdata = await students.getById(student.id)
          console.log('student data')
          console.log(studentdata)
          console.log('end student data')
          if (studentdata.fullName != undefined && studentdata.email != undefined) {
            console.log('send student data')
            students.inviteStudentToLesson(
              studentdata.fullName,
              studentdata.email,
              id
            ).then(data => {

            })
              .catch(err => {
              })
          }
        }

      })
    )

    return lessons
      .updateById(id, data)
      .then(() => getFullLesson(id))
      .then(lesson => res.send(lesson))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.delete("/:id", (req, res) => {
    const { id } = req.params
    const { creationDate } = req.query

    return lessons
      .deleteById(id, creationDate)
      .then(data => res.send({ success: true }))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  router.post("/:id/results", (req, res) => {
    const lessonId = req.params.id
    const studentId = req.user.id
    const results = req.data

    return lessons
      .result(lessonId, studentId, results)
      .then(() => res.send({ success: true }))
      .catch(error => res.send({ success: false, error: error.message }))
  })

  return router
}
