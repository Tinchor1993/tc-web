import React from 'react'
import { reduxForm } from 'redux-form'

import { FormController } from '../../../Forms/Components'

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
    name="controlledExampleForm"
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
    basic
  </FormController>
)

const ControlledExampleForm = reduxForm({
  form: 'controlledAdvancedForm'
})(Form)

export default ControlledExampleForm
