import React from 'react'
import { Field, reduxForm } from 'redux-form'

const FilterElementsForm = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  editMode,
  cancelLink
}) => (
  <form onSubmit={handleSubmit} className="elements-filter-form">
    <div className="elements-tool-bar-form">
      <div className="col-md-1 col-md-offset-4">
        <div className="checkbox">
          <label>
            <Field component="input" name="audio" type="checkbox" /> Audio
          </label>
        </div>
      </div>
      <div className="col-md-1">
        <div className="checkbox">
          <label>
            <Field component="input" name="video" type="checkbox" /> Video
          </label>
        </div>
      </div>
      <div className="col-md-3">
        <div className="form-group">
          <Field
            component="input"
            name="elementName"
            type="search"
            className="form-control"
            placeholder="Search"
          />
        </div>
      </div>
    </div>
  </form>
)

export default reduxForm({
  form: 'filterElement'
})(FilterElementsForm)
