import React from 'react'

import './LessonElementCard.scss'

const LessonElementCard = ({ preview, titleEn, objectives }) => (
  <div className="elements-item">
    <div className="media">
      <div className="media-left">
        <a href="#">
          <img className="media-object" src={preview} alt="preview" />
        </a>
      </div>

      <div className="media-body">
        <h4 className="media-heading">{titleEn}</h4>
        <p>{objectives}</p>
      </div>
    </div>
  </div>
)

export default LessonElementCard
