/**
 * Created by syxou on 17/06/2017.
 */
import React from 'react'
import './SlidesStyle.scss'

const TitleCenter = ({ title, settings: { textSize, textColor } }) => (
  <div className="slider-title">
    <h1
      style={{
        fontSize: `${textSize}px`,
        color: `${textColor}`
      }}
    >
      {title}
    </h1>
  </div>
)

export default TitleCenter
