import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import classNames from 'classnames'

import './FormStyle.scss'

import {
  renderInput,
  TextareaField,
  IconField,
  SelectField
} from '../../../../modules/Forms'

const validate = values => {
  const errors = {}

  if (isEmpty(values.titleEn)) {
    errors.titleEn = 'Title cannot be empty'
  }

  return errors
}

const EditSubjectForm = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  editMode,
  cancelLink,
  lessons
}) => (
  <form onSubmit={handleSubmit}>
    <div className="row">
      <div className="col-md-8">
        <Field
          name="titleEn"
          styles={{
            wrapper: 'form-group',
            label: 'control-label',
            hasError: 'has-error'
          }}
          label="Title En"
          component={renderInput}
          className="form-control"
          componentType={TextareaField}
        />
        <Field
          name="titleEs"
          styles={{
            wrapper: 'form-group',
            label: 'control-label',
            hasError: 'has-error'
          }}
          label="Title Es"
          component={renderInput}
          className="form-control"
          componentType={TextareaField}
        />

        <Field
          name="preview"
          component={renderInput}
          styles={{
            wrapper: 'form-group test',
            label: 'control-label',
            hasError: 'has-error'
          }}
          label="Icon"
          className="form-control"
          componentType={IconField}
        />
      </div>
    </div>

    <div className="row">
      <div className="edit-from-btn-group pull-right">
        {editMode && (
          <button
            type="button"
            className="btn-thc medium btn-thc-danger"
            disabled={submitting}
            onClick={reset}
          >
            Clear Values
          </button>
        )}

        {!editMode && (
          <Link to={cancelLink} className="btn-thc btn-thc-danger medium">
            Cancel
          </Link>
        )}

        <button
          type="submit"
          className="btn-thc medium btn-custom"
          disabled={submitting}
        >
          {editMode ? 'Save' : 'Create'}
        </button>
      </div>
    </div>
  </form>
)

export default reduxForm({
  form: 'editSubject',
  validate
})(EditSubjectForm)
