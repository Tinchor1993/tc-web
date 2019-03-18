import React from 'react'
import LessonPresentationSlide from '../LessonPresentationSlide/LessonPresentationSlide'
import './LessonPresentationList.scss'

const LessonPresentationList = ({ presentation }) => (
  <div className="lessons-presentation-container">
    <div className="row">
      {presentation.map((sl, index) => (
        <LessonPresentationSlide key={index} preview={sl.preview} />
      ))}
    </div>
  </div>
)

export default LessonPresentationList
