import React, { PropTypes } from 'react'
import './LessonCardCreate.scss'
import Card from '../../../Dashboard/Components/Card/Card'

const LessonCardCreate = ({ key }) => (
  <Card
    col="4"
    className="lesson create"
    key={key}
    to={`/dashboard/lessons/new/edit`}
  >
    <div className="">
      <p>Create Lesson</p>
      <button type="button" className="btn-add">
        <span className="icon">+</span>
      </button>
    </div>
  </Card>
)

export default LessonCardCreate
