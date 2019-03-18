import React, { PropTypes } from 'react'

import './SubjectsCardCreate.scss'

import Card from '../../../Dashboard/Components/Card/Card'

const SubjectsCreate = ({ key }) => (
  <Card
    col="4"
    to={`/dashboard/subjects/new/edit`}
    className="subject create"
    key={key}
  >
    <p>Create Subject</p>
    <button type="button" className="btn-add">
      <span className="icon">+</span>
    </button>
  </Card>
)

export default SubjectsCreate
