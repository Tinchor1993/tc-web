import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Card from '../../../Dashboard/Components/Card/Card'
import './LessonCard.scss'
import classNames from 'classnames'

const LessonItem = ({ id, titleEn, objectivesEn, key, draft }) => (
  <Card
    col="4"
    to={`/dashboard/lessons/${id}`}
    className={classNames('lesson', { disabled: draft })}
    key={key}
  >
    <div className="lesson-info">
      <p className="lesson-name">
        {titleEn}
        <Link to={`/dashboard/lessons/${id}/edit`}>
          <i className="ti-pencil" />
        </Link>
      </p>
      <p className="lesson-objectives">{objectivesEn}</p>
    </div>
  </Card>
)

export default LessonItem
