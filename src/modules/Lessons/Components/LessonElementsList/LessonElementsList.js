import React from 'react'

import LessonElementCard from '../LessonElementCard/LessonElementCard'

const LessonElementList = ({ elements }) => (
  <div>
    {elements.map((el, index) => <LessonElementCard key={index} {...el} />)}
  </div>
)

export default LessonElementList
