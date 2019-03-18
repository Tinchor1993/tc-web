import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { isEmpty } from 'lodash'
import {
  renderInput,
  SelectField,
  TextareaField
} from '../../../../modules/Forms'

const validate = values => {
  const errors = {}
  if (isEmpty(values.name)) {
    errors.name = 'Cannot be empty'
  }
  if (isEmpty(values.surname)) {
    errors.surname = 'Cannot be empty'
  }
  if (isEmpty(values.email)) {
    errors.email = 'Cannot be empty'
  }

  return errors
}

import levels from '../../Constants/levels'

const InviteStudentForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="name"
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        label="Name"
        component={renderInput}
        className="form-control"
        componentType={TextareaField}
      />

      <Field
        name="surname"
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        label="Surname"
        component={renderInput}
        className="form-control"
        componentType={TextareaField}
      />
      <Field
        name="email"
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        label="Email"
        type="email"
        component={renderInput}
        className="form-control"
        componentType={TextareaField}
      />

      <div className="form-group">
        <Field
          label="Level"
          name="level"
          component={renderInput}
          componentType={SelectField}
          placeholder="Level"
          options={levels}
        />
      </div>

      <div className="row">
        <div className="pull-right">
          <button
            type="button"
            className="btn-thc medium btn-thc-danger"
            disabled={pristine || submitting}
            onClick={reset}
          >
            Clear Values
          </button>

          <button
            type="submit"
            className="btn-thc medium "
            disabled={pristine || submitting}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'invite',
  validate
})(InviteStudentForm)
