import React from 'react'
import './LessonsToolBar.scss'
import FilterLessons from '../../Components/LessonsFilterForm'

const LessonsToolBar = () => (
  <div className="lessons-tool-bar">
    <i className="glyphicon glyphicon-th-large" />
    <i className="glyphicon glyphicon glyphicon-th" />
    <i className="glyphicon glyphicon-th-list" />
    <FilterLessons />
  </div>
)
export default LessonsToolBar
