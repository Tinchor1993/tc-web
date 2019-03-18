import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'

import './SubjectsCard.scss'

import Card from '../../../Dashboard/Components/Card/Card'

const SubjectCard = ({ titleEn, id, quantity, preview, key }) => (
  <Card col="4" to={`/dashboard/subjects/${id}`} className="subject" key={key}>
    <div className="icon">
      <i className={classNames('icon', `ti-${preview}`)} />
    </div>
    <div className="title">{titleEn}</div>
    <div className="description">
      <p>{quantity} Lessons</p>
    </div>
  </Card>
)

export default SubjectCard
