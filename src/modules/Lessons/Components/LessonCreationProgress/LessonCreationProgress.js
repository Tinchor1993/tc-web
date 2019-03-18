import React from 'react'
import classNames from 'classnames'

import './LessonCreationProgress.scss'

import {
  INFO,
  PRESENTATION,
  SORTING,
  QUIZ,
  ORDERING,
  INVITE
} from '../../Constants/steps'

const isActive = (activeStep, step) => activeStep === step

const LessonCreationProgress = ({ activeStep = INFO, onClick }) => (
  <ol className="breadcrumb lesson-progress">
    <li
      onClick={() => onClick(INFO)}
      className={classNames('step', { active: isActive(activeStep, INFO) })}
    >
      <p className="index">1</p>
      <p className="name">
        Lesson<br />Information
      </p>
    </li>
    <li
      onClick={() => onClick(PRESENTATION)}
      className={classNames('step', {
        active: isActive(activeStep, PRESENTATION)
      })}
    >
      <p className="index">2</p>
      <p className="name">
        Presentation<br />Mode
      </p>
    </li>
    <li
      onClick={() => onClick(SORTING)}
      className={classNames('step', { active: isActive(activeStep, SORTING) })}
    >
      <p className="index">3</p>
      <p className="name">
        Sorting<br />Mode
      </p>
    </li>
    <li
      onClick={() => onClick(QUIZ)}
      className={classNames('step', { active: isActive(activeStep, QUIZ) })}
    >
      <p className="index">4</p>
      <p className="name">
        Quiz<br />Mode
      </p>
    </li>
    <li
      onClick={() => onClick(ORDERING)}
      className={classNames('step', { active: isActive(activeStep, ORDERING) })}
    >
      <p className="index">5</p>
      <p className="name">
        Ordering<br />Mode
      </p>
    </li>
    <li
      onClick={() => onClick(INVITE)}
      className={classNames('step', { active: isActive(activeStep, INVITE) })}
    >
      <p className="index">6</p>
      <p className="name">
        Invite <br /> students
      </p>
    </li>
  </ol>
)

export default LessonCreationProgress
