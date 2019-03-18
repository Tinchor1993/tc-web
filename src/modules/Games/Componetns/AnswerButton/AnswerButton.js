import React from 'react'
import classNames from 'classnames'

const AnswerButton = ({ text, isCorrect, answered = true, onClick }) => (
  <li
    className={classNames('answer-item animated', {
      'correct pulse': answered && isCorrect,
      'incorrect wobble': answered && !isCorrect
    })}
    onClick={onClick}
  >
    <button className="web-app-btn-answer">{text}</button>
  </li>
)

export default AnswerButton
