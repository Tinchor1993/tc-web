import React from 'react'

const Qoute = ({ text, settings: { textSize } }) => (
  <div className="slider-title ">
    <blockquote style={{ fontSize: `${textSize}px` }}>{text}</blockquote>
  </div>
)

export default Qoute
