import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { isEmpty } from 'lodash'
import classNames from 'classnames'

import { renderInput, TextareaField } from '../../../modules/Forms'

const validate = values => {
  const errors = {}
  if (isEmpty(values.login)) {
    errors.login = 'Cannot be empty'
  }
  if (isEmpty(values.password)) {
    errors.password = 'Cannot be empty'
  }
  return errors
}

const LoginForm = props => {
  const { handleSubmit, pristine, submitting } = props
  const { customError } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="login"
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        label="Login"
        component={renderInput}
        className="form-control"
        componentType={TextareaField}
      />
      <Field
        name="password"
        type="password"
        styles={{
          wrapper: 'form-group',
          label: 'control-label',
          hasError: 'has-error'
        }}
        label="Password"
        component={renderInput}
        className="form-control"
        componentType={TextareaField}
      />

      {customError && (
        <p className="text-danger">
          <b>
            <i className="ti-alert"> </i>
            {customError}
          </b>
        </p>
      )}

      <br />
      <div>
        <button
          className="btn-thc medium"
          type="submit"
          disabled={pristine || submitting}
        >
          Login
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'login',
  validate
})(LoginForm)
