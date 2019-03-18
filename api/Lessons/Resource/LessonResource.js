const express = require('express')
const multer = require('multer')
const map = require('lodash/map')
const filter = require('lodash/filter')
const lodash = require('lodash')

const router = express.Router()

import ElementsDAO from '../../Elements/DAO/ElementsDAO'
import SubjectsDAO from '../../Subjects/DAO/SubjectsDAO'
import StudentsDAO from '../../Students/DAO/StudentsDAO'
import LessonsDAO from '../DAO/LessonsDAO'
import LessonQuizzesDAO from '../DAO/LessonQuizzzesDAO'
import LessonQuizQuestionsDAO from '../DAO/LessonQuizQuestionsDAO'
import LessonQuizAnswersDAO from '../DAO/LessonQuizQuestionAnswersDAO'
import LessonPresentationDAO from '../DAO/LessonPresentationDAO'
import LessonResultsDAO from '../DAO/LessonResultsDAO'
import pretty from '../../Helpers/pretty'

/**
 * Answers
 */
router.get('/:lessonId/quizzes/:quizId/questions/:questionId/answers', function(
  req,
  res
) {
  LessonQuizAnswersDAO.getAnswersByQuizId(req.params.questionId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get(
  '/:lessonId/quizzes/:quizId/questions/:questionId/answers/:answerId',
  function(req, res) {
    LessonQuizAnswersDAO.getAnswerById(req.params.answerId)
      .then(data => {
        if (lodash.isUndefined(data)) {
          res.sendStatus(404)
        }
        res.send(data.Items)
      })
      .catch(err => {
        res.send(err)
      })
  }
)

router.post(
  '/:lessonId/quizzes/:quizId/questions/:questionId/answers',
  function(req, res) {
    LessonQuizAnswersDAO.createAnswer(req.body, req.params.questionId).then(
      data => {
        LessonQuizAnswersDAO.getAnswerById(data)
          .then(data => {
            res.send(data.Items)
          })
          .catch(err => {
            if (err.code === '23503') res.sendStatus(404)
            else res.send(err)
          })
      }
    )
  }
)

router.put(
  '/:lessonId/quizzes/:quizId/questions/:questionId/answers/:answerId',
  function(req, res) {
    LessonQuizAnswersDAO.updateAnswer(req.params.answerId, req.body)
      .then(data => {
        if (lodash.isUndefined(data)) {
          res.sendStatus(404)
        }
        res.send(data.Items)
      })
      .catch(err => {
        res.send(err)
      })
  }
)

router.delete(
  '/:lessonId/quizzes/:quizId/questions/:questionId/answers/:answerId',
  function(req, res) {
    LessonQuizAnswersDAO.deleteAnswer(req.params.answerId)
      .then(data => {
        res.send(data.Items)
      })
      .catch(err => {
        res.send(err)
      })
  }
)

/**
 * Questions
 */
router.get('/:lessonId/quizzes/:quizId/questions', function(req, res) {
  LessonQuizQuestionsDAO.getQuestionsByQuizId(req.params.quizId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:lessonId/quizzes/:quizId/questions/:questionId', function(
  req,
  res
) {
  LessonQuizQuestionsDAO.getQuestionById(req.params.questionId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items[0])
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/:lessonId/quizzes/:quizId/questions', function(req, res) {
  LessonQuizQuestionsDAO.createQuestion(req.body, req.params.quizId).then(
    data => {
      LessonQuizQuestionsDAO.getQuestionById(data)
        .then(data => {
          res.send(data.Items)
        })
        .catch(err => {
          if (err.code === '23503') res.sendStatus(404)
          else res.send(err)
        })
    }
  )
})

router.put('/:lessonId/quizzes/:quizId/questions/:questionId', function(
  req,
  res
) {
  LessonQuizQuestionsDAO.updateQuestion(req.params.questionId, req.body).then(
    data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items)
    }
  )
})

router.delete('/:lessonId/quizzes/:quizId/questions/:questionId', function(
  req,
  res
) {
  LessonQuizQuestionsDAO.deleteQuestion(req.params.quizId)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

/**
 * Quizzes
 */
router.get('/:lessonId/quizzes', function(req, res) {
  LessonQuizzesDAO.getQuizzesByLessonId(req.params.lessonId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:lessonId/quizzes/:quizId/', function(req, res) {
  LessonQuizzesDAO.getQuizById(req.params.quizId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items[0])
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/:lessonId/quizzes', function(req, res) {
  LessonQuizzesDAO.createLessonQuizzes(req.params.lessonId).then(data => {
    LessonQuizzesDAO.getQuizById(data)
      .then(data => {
        res.send(data.Items)
      })
      .catch(err => {
        if (err.code === '23503') res.sendStatus(404)
        else res.send(err)
      })
  })
})

router.delete('/:lessonId/quizzes/:quizId', function(req, res) {
  LessonQuizzesDAO.deleteLessonQuizzes(req.params.quizId)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/:lessonId/quizzes/:quizId', function(req, res) {
  LessonQuizzesDAO.updateLessonQuizzes(req.params.quizId, req.body).then(
    data => {
      res.send(data.Items)
    }
  )
})

/**
 * Presentations
 */
router.get('/:lessonId/presentation', function(req, res) {
  LessonPresentationDAO.getPresentationsByLessonId(req.params.lessonId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:lessonId/presentation/:presentationId/', function(req, res) {
  LessonPresentationDAO.getPresentationById(req.params.presentationId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items[0])
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:lessonId/presentation/:presentationId/slide', function(req, res) {
  LessonPresentationDAO.getSlidesByLessonId(req.params.presentationId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:lessonId/presentation/:presentationId/slide/:slideId', function(
  req,
  res
) {
  LessonPresentationDAO.getSlideById(req.params.slideId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items[0])
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/:lessonId/presentation', function(req, res) {
  LessonPresentationDAO.createLessonPresentations(
    req.body,
    req.params.lessonId
  ).then(data => {
    LessonPresentationDAO.getPresentationById(data)
      .then(data => {
        res.send(data.Items)
      })
      .catch(err => {
        if (err.code === '23503') res.sendStatus(404)
        else res.send(err)
      })
  })
})

router.post('/:lessonId/presentation/:presentationId/slide', function(
  req,
  res
) {
  LessonPresentationDAO.createSlide(req.params.presentationId, req.body).then(
    data => {
      LessonPresentationDAO.getPresentationById(data)
        .then(data => {
          res.send(data.Items)
        })
        .catch(err => {
          if (err.code === '23503') res.sendStatus(404)
          else res.send(err)
        })
    }
  )
})

router.delete('/:lessonId/presentation/:presentationId', function(req, res) {
  LessonPresentationDAO.deleteLessonPresentations(req.params.presentationId)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.delete(
  '/:lessonId/presentation/:presentationId/slide/:slideId',
  function(req, res) {
    LessonPresentationDAO.deleteSlide(req.params.slideId)
      .then(data => {
        res.send(data.Items)
      })
      .catch(err => {
        res.send(err)
      })
  }
)

router.put('/:lessonId/presentation/:presentationId', function(req, res) {
  LessonPresentationDAO.updateLessonPresentations(
    req.params.presentationId,
    req.body
  )
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

/**
 * Results
 */
router.get('/:lessonId/results', function(req, res) {
  LessonResultsDAO.getResultsByLessonId(req.params.lessonId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:lessonId/results/:resultId/', function(req, res) {
  LessonResultsDAO.getResultById(req.params.resultId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items[0])
    })
    .catch(err => {
      res.send(err)
    })
})

router.post('/:lessonId/results/', function(req, res) {
  LessonResultsDAO.createResult(
    req.params.lessonId,
    req.user.id,
    req.body
  ).then(data => {
    LessonQuizzesDAO.getQuizById(data)
      .then(data => {
        res.send(data.Items)
      })
      .catch(err => {
        if (err.code === '23503') res.sendStatus(404)
        else res.send(err)
      })
  })
})

router.delete('/:lessonId/results/:resultId', function(req, res) {
  LessonResultsDAO.deleteResultById(req.params.resultId, req.query.q)
    .then(data => {
      res.send(data.Items)
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/:lessonId/results/:resultId', function(req, res) {
  LessonQuizzesDAO.updateLessonQuizzes(req.params.quizId, req.body).then(
    data => {
      res.send(data.Items)
    }
  )
})

/**
 * api
 */

router.get('/gameSelector', function(req, res) {
  if (!req.user.id) {
    res.send([])
  }
  StudentsDAO.getStudentByGoogleId(req.user.id).then(student => {
    LessonsDAO.getLessonsGameSelector(student.Items[0].id).then(data => {
      let lessons = data.Items
      if (!lessons.length) {
        res.send([])
      }
      lessons.map(async (lesson, index) => {
        lesson.isPlayed = await LessonResultsDAO.isPlayedByCurrentUser(
          req.user.id,
          lesson.id
        ).then(bool => bool)
        delete lesson.sorting
        delete lesson.presentation
        delete lesson.quiz
        delete lesson.ordering
        if (index === data.Items.length - 1) {
          res.send(lessons)
        }
      })
    })
  })
})

router.get('/:id/isPlayed', function(req, res) {
  LessonResultsDAO.isPlayedByCurrentUser(req.user.id, req.params.id)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/results', function(req, res) {
  const size = req.query.size || 9999
  const id = req.query.id || undefined
  const creationDate = req.query.creationDate || undefined
  const status = req.query.status || undefined
  LessonResultsDAO.getAllResults(size, id, creationDate, status)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      let count = 0
      let results = data.Items
      let size = results.length
      results.forEach(function(item) {
        StudentsDAO.getStudentByGoogleId(item.studentId).then(data => {
          item.user = {}
          item.user = data.Items[0]
          delete item.studentId
          count++
          if (count === size) res.send(results)
        })
      })
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/:id/test_data', (req, res) => {
  LessonQuizzesDAO.getQuestionsAndAnswersByLessonId(req.params.id).then(
    quiz => {
      res.send(quiz)
    }
  )
})

router.get('/:id', function(req, res) {
  let lesson = {}
  LessonsDAO.getLessonById(req.params.id).then(data => {
    let students = []
    lesson = data.Items[0]
    lesson.invite.students.map((value, index) => {
      StudentsDAO.getStudentById(value).then(data => {
        const student = data.Items[0]
        students.push({
          id: student.id,
          fullName: student.fullName,
          type: 'exist'
        })
      })
      if (index === lesson.invite.students.length - 1) {
        lesson.invite.students = students
      }
    })
    if (lesson.subject !== undefined) {
      SubjectsDAO.getSubjectById(lesson.subject).then(data => {
        lesson.subject = data.Items
        lesson.subject.forEach(function(item) {
          delete item.titleEs
          delete item.quantity
          delete item.creationDate
          delete item.preview
          item.value = item.id
          item.label = item.titleEn
          delete item.id
          delete item.titleEn
        })
        lesson.subject = lesson.subject[0]
      })
    }
    LessonPresentationDAO.getSlidesByLessonId(lesson.id).then(data => {
      lesson.presentation = data.Items[0]
      LessonQuizzesDAO.getQuestionsAndAnswersByLessonId(lesson.id).then(
        quiz => {
          lesson.quiz = quiz
          let count = 0
          lesson.elements = []
          if (lesson.sorting.elements.length !== 0) {
            lesson.sorting.elements.forEach(function(item) {
              ElementsDAO.getElementById(item.id).then(data => {
                if (data.Count !== 0) {
                  data.Items[0].isCorrect = item.isCorrect
                  lesson.elements.push(data.Items[0])
                } else {
                  lesson.sorting.elements[count] = {}
                }
                count++
                if (count === lesson.sorting.elements.length) {
                  lesson.sorting.elements = lesson.elements
                  delete lesson.elements
                  lesson = pretty(lesson)
                  res.send(lesson)
                }
              })
            })
          } else {
            lesson.sorting.elements = lesson.elements
            delete lesson.elements
            lesson = pretty(lesson)
            res.send(lesson)
          }
        }
      )
    })
  })
})

router.get('/results/filter', function(req, res) {
  LessonResultsDAO.getResultsByStudentId(req.query.studentId)
    .then(data => {
      if (lodash.isUndefined(data)) {
        res.sendStatus(404)
      }
      res.send(data.Items[0])
    })
    .catch(err => {
      res.send(err)
    })
})

router.get('/', function(req, res) {
  const size = req.query.size || 9999
  const id = req.query.id || undefined
  const creationDate = req.query.creationDate || undefined
  const status = req.query.status || undefined
  LessonsDAO.getLessons(size, id, creationDate, status)
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
  LessonsDAO.getLessonsByName(
    name,
    size,
    id,
    creationDate,
    status,
    0,
    globalData
  )
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      if (err.code === '23503') res.sendStatus(404)
      else res.send(err)
    })
})

router.post('/', function(req, res) {
  let expires
  let accessToken
  if (!req.body.invite.students) {
    req.body.invite = {}
    req.body.invite.students = []
  }
  let debug = {}
  req.body.invite.students = req.body.invite.students.filter(
    student => !student.isDeleted
  )

  const students = req.body.invite.students.map(student => {
    if (student.id) {
      return Promise.resolve(student)
    }
    if (student.type === 'new') {
      if (!student.name || !student.surname || !student.email)
        return Promise.resolve({ type: 'new', id: undefined })
      return StudentsDAO.getStudentByEmail(student.email).then(data => {
        if (data.count !== 0) {
          return data.Items[0]
        } else {
          return StudentsDAO.getAccessToken()
            .then(data => {
              expires = data.expires
              accessToken = data.accessToken
              return StudentsDAO.registerStudents(
                student.name,
                student.surname,
                student.email
              )
            })
            .then(data => {
              StudentsDAO.inviteStudent(
                student.name,
                student.surname,
                student.email,
                data.id,
                data.creationDate,
                accessToken,
                expires
              )

              return data
            })
        }
      })
    } else {
      return Promise.resolve({ type: 'exist', id: undefined })
    }
  })

  Promise.all(students)
    .then(studentsData => {
      debug.students = studentsData
      debug.body = req.body

      req.body.invite.students = studentsData
        .filter(student => !!student.id)
        .map(student => student.id)
      return LessonsDAO.createLesson(req.body)
    })
    .then(data => {
      console.log(data)
      res.send(data)
    })
    .catch(err => {
      if (err.code === '23503') {
        console.log('who')
        res.sendStatus(404)
      } else {
        console.log(req.body.invite.students)
        console.log(err)
        res.send(err)
      }
    })
})

router.delete('/:id', function(req, res) {
  const creationDate = req.query.creationDate
  LessonsDAO.deleteLesson(req.params.id, creationDate)
    .then(data => {
      LessonPresentationDAO.getPresentationsByLessonId(req.params.id).then(
        data => {
          LessonPresentationDAO.deleteLessonPresentations(data.id).then(
            data => {
              LessonQuizzesDAO.getQuizzesByLessonId(req.params.id).then(
                data => {
                  const id = data.Items[0].id
                  LessonQuizAnswersDAO.getAnswersByQuizId(id).then(data => {
                    let count = 0
                    const size = data.Items.length
                    if (size !== 0) {
                      data.Items.forEach(function(item) {
                        LessonQuizAnswersDAO.deleteAnswer(
                          item.id,
                          item.creationDate
                        ).then(() => {
                          count++
                          if (count === size) {
                            LessonQuizzesDAO.deleteLessonQuizzes(id).then(
                              data => {
                                res.send(data)
                              }
                            )
                          }
                        })
                      })
                    } else {
                      res.send(data)
                    }
                  })
                }
              )
            }
          )
        }
      )
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/:id', function(req, res) {
  let expires
  let accessToken

  console.log('here?')

  req.body.invite.students = req.body.invite.students.filter(
    student => !student.isDeleted
  )

  console.log('here2')
  const students = req.body.invite.students.map(student => {
    if (student.id) {
      return Promise.resolve(student)
    } else if ((student.type = 'new')) {
      if (!student.name || !student.surname || !student.email)
        return Promise.resolve({ type: 'new', id: undefined })

      return StudentsDAO.getStudentByEmail(student.email).then(data => {
        if (data.count !== 0) {
          return data.Items[0]
        } else {
          return StudentsDAO.getAccessToken()
            .then(data => {
              expires = data.expires
              accessToken = data.accessToken
              return StudentsDAO.registerStudents(
                student.name,
                student.surname,
                student.email
              )
            })
            .then(data => {
              StudentsDAO.inviteStudent(
                student.name,
                student.surname,
                student.email,
                data.id,
                data.creationDate,
                accessToken,
                expires
              )

              return data
            })
        }
      })
    } else {
      return Promise.resolve({ type: 'exist', id: undefined })
    }
  })

  console.log('here2')

  Promise.all(students)
    .then(studentsData => {
      req.body.invite.students = studentsData
        .filter(student => !!student.id)
        .map(student => student.id)
      return LessonsDAO.updateLesson(req.params.id, req.body)
    })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      if (err.code === '23503') {
        res.sendStatus(404)
      } else {
        res.send(err)
      }
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
