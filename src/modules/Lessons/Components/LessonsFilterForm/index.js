import React from 'react'
import { Field, reduxForm } from 'redux-form'

const LessonsFilterForm = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  editMode,
  cancelLink
}) => (
  <form onSubmit={handleSubmit} className="form-group">
    <Field
      component="input"
      type="search"
      className="form-control"
      name="lesson-filter"
      placeholder="Search"
    />
    <div className="checkbox">
      <label>
        <Field component="input" name="video" type="checkbox" /> Math
      </label>
    </div>
    <div className="checkbox">
      <label>
        <Field component="input" name="video" type="checkbox" /> Biology
      </label>
    </div>
    <div className="checkbox">
      <label>
        <Field component="input" name="video" type="checkbox" /> Music
      </label>
    </div>
  </form>
)

export default reduxForm({
  form: 'filterLessons'
})(LessonsFilterForm)
