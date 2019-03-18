import React from 'react'
import QuestionTimer from '../../Componetns/QuestionTimer/QuestionTimer'

import QuestionTitle from '../QuestionTitle/QuestionTitle'
import AnswersList from '../AnswersList/AnswersList'
import AnswersGrid from '../AnswersGrid/AnswersGrid'

import {
  isTextMedia,
  isText,
  isMedia,
  isElement
} from '../../../Presentation/Constants/quizLayouts'

const QuizDetails = ({
  questions = [],
  layout,
  onAnswerClick,
  hasTimer = false,
  current,
  answered
}) => (
  <div className="question-details">
    <QuestionTitle title={questions[current].text} />
    {answered}
    {isText(questions[current].layout) && (
      <AnswersList
        layout={questions[current].layout}
        elements={false}
        answers={questions[current].answers}
        answered={answered}
        onAnswerClick={onAnswerClick}
      />
    )}

    {isMedia(questions[current].layout) && (
      <AnswersGrid
        layout={questions[current].layout}
        elements={false}
        answers={questions[current].answers}
        answered={answered}
        onAnswerClick={onAnswerClick}
      />
    )}

    {isElement(questions[current].layout) && (
      <AnswersGrid
        layout={questions[current].layout}
        elements={true}
        showDescription={questions[current].showDescription}
        answers={questions[current].answers}
        answered={answered}
        onAnswerClick={onAnswerClick}
      />
    )}

    {isTextMedia(questions[current].layout) && (
      <AnswersGrid
        layout={questions[current].layout}
        elements={false}
        answers={questions[current].answers}
        answered={answered}
        onAnswerClick={onAnswerClick}
      />
    )}

    {hasTimer && <QuestionTimer />}
  </div>
)

export default QuizDetails
