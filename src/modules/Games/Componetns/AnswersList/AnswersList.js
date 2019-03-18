import React from 'react'

import AnswerButton from '../AnswerButton/AnswerButton'
import './AnswersList.scss'

const AnswersList = ({ answers = [], onAnswerClick, answered }) => (
  <ul className="answer-list">
    {answers.map((answer, index) => (
      <AnswerButton
        answered={answered}
        key={index}
        {...answer}
        onClick={() => onAnswerClick(answer)}
      />
    ))}
  </ul>
)

export default AnswersList
