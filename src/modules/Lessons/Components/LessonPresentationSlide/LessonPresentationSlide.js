import React from 'react'

const LessonPresentationSlide = ({ preview }) => (
  <div className="col-md-2">
    <div className="slide-card">
      <img src={preview} alt="Slide preview" />
    </div>
  </div>
)
export default LessonPresentationSlide
