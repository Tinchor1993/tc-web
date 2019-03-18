import React from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import './SubjectDetails.scss'

const SubjectDetails = ({
  id,
  titleEn,
  titleEs,
  preview,
  quantity,
  lessons = [],
  editLink,
  creationDate,
  onDelete
}) => (
  <div className="subject-details">
    <div className="row">
      <div className="col-md-12">
        <h4 className=""> Title: {titleEn}</h4>
        <h5 className=""> Title ES: {titleEs}</h5>
      </div>
    </div>

    <div className="row">
      <div className="col-md-12">
        {preview && (
          <div className="col-md-4">
            <div className="icon">
              <i className={classNames('icon', `ti-${preview}`)} />
            </div>
          </div>
        )}
      </div>
    </div>

    <div className="row">
      <div className="col-md-12">
        <p className="level-quantity">
          Number of lessons: <span className="count">{quantity}</span>
        </p>
        <ul className="list-unstyled">
          {lessons.map((l, index) => (
            <li key={index} className="lessons-list-item">
              {' '}
              <strong> Level {l.level} </strong>.{' '}
              <Link to={`/dashboard/lessons/${l.id}`}>{l.titleEn}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="row">
      <div className="edit-from-btn-group pull-right clearfix">
        <button
          className="btn-delete "
          onClick={() => onDelete(id, creationDate)}
        >
          Delete
        </button>
        <Link to={`/dashboard/subjects/${id}/edit`} className="btn-edit">
          Edit
        </Link>
      </div>
      <Link
        to={`/dashboard/lessons/new/edit?subjectId=${JSON.stringify({
          label: titleEn,
          value: id
        })}`}
        className="btn-edit add-lesson"
      >
        Add lesson
      </Link>
    </div>
  </div>
)

export default SubjectDetails
