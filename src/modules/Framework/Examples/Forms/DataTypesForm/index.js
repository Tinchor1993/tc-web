import React from 'react'
import { reduxForm, Field } from 'redux-form'

import { FormController, renderField } from '../../../Forms/Components'

import DataTypesExampleFormValidator from './DataTypesExampleFormValidator'

const Form = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  customSubmitting,
  invalid,
  submitSucceeded,
  submitFailed,
  customSuccess,
  customError
}) => (
  <FormController
    name="dataTypes"
    submitValue={<div>Save</div>}
    handleSubmit={handleSubmit}
    btnWrapperClasses="col-md-12"
    pristine={pristine}
    reset={reset}
    submitting={submitting}
    customSubmitting={customSubmitting}
    invalid={invalid}
    submitSucceeded={submitSucceeded}
    submitFailed={submitFailed}
    customSuccess={customSuccess}
    customError={customError}
  >
    <Field
      name="vat"
      type="text"
      component={renderField}
      label="Vat"
      fieldWrapperClasses=""
      labelWrapperClasses="first"
    />

    <Field
      name="ssn"
      type="text"
      component={renderField}
      label="SSN"
      fieldWrapperClasses=""
      labelWrapperClasses="first"
    />
  </FormController>
)

const DataTypesExampleForm = reduxForm({
  form: 'dataTypesForm',
  validate: DataTypesExampleFormValidator
})(Form)

export default DataTypesExampleForm
