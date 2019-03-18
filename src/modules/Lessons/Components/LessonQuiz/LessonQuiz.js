import React from 'react'

import LessonQuestionAnswer from '../LessonQuestionAnswer/LessonQuestionAnswer'

const LessonQuiz = ({ questions = [] }) => (
  <div>
    {questions.map(q => (
      <div className="quiz-container">
        <h4 className="quiz-question">{q.question}</h4>
        <ul>
          {q.answers.map((question, index) => (
            <LessonQuestionAnswer key={index} {...question} />
          ))}
        </ul>
      </div>
    ))}
  </div>
)

export default LessonQuiz
