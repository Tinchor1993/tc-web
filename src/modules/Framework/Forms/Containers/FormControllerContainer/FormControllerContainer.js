import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  getFormValues,
  getFormInitialValues,
  getFormSyncErrors,
  getFormAsyncErrors,
  getFormSubmitErrors,
  isDirty,
  isPristine,
  isValid,
  isInvalid,
  isSubmitting,
  hasSubmitSucceeded,
  hasSubmitFailed,
  reset
} from 'redux-form'

import FormController from '../../Components/FormController/FormController'

class FormControllerContainer extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,

    handleSubmit: PropTypes.func,

    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    invalid: PropTypes.bool,
    dirty: PropTypes.bool,

    buttonsPosition: PropTypes.string,

    submitValue: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    resetValue: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    customSuccess: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    customError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

    btnWrapperClasses: PropTypes.string,
    showButtons: PropTypes.bool,
    showReset: PropTypes.bool,

    children: PropTypes.node,

    handleReset: PropTypes.func,

    reset: PropTypes.func,

    debug: PropTypes.bool,
    values: PropTypes.object
  }

  constructor() {
    super()

    this.handleReset = this.handleReset.bind(this)
  }

  handleReset() {
    const { name } = this.props

    if (this.props.handleReset) {
      this.props.handleReset()
    }

    this.props.reset(name)
  }

  render() {
    const { name } = this.props

    const { handleSubmit } = this.props
    const { submitSucceeded, submitting, pristine, invalid, dirty } = this.props
    const { submitValue, resetValue } = this.props
    const { customSuccess, customError } = this.props
    const { btnWrapperClasses } = this.props
    const { showButtons, showReset, buttonsPosition } = this.props

    const { children } = this.props

    const { debug = true } = this.props
    const { values } = this.props

    return (
      <FormController
        name={name}
        debug={debug}
        values={values}
        handleReset={this.handleReset}
        handleSubmit={handleSubmit}
        submitSucceeded={submitSucceeded}
        submitting={submitting}
        pristine={pristine}
        invalid={invalid}
        dirty={dirty}
        submitValue={submitValue}
        resetValue={resetValue}
        customSuccess={customSuccess}
        customError={customError}
        btnWrapperClasses={btnWrapperClasses}
        buttonsPosition={buttonsPosition}
        showButtons={showButtons}
        showReset={showReset}
      >
        {children}
      </FormController>
    )
  }
}

export default connect(
  (state, ownProps) => {
    const { name } = ownProps

    return {
      values: getFormValues(name)(state),
      initialValues: getFormInitialValues(name)(state),
      syncErrors: getFormSyncErrors(name)(state),
      asyncErrors: getFormAsyncErrors(name)(state),
      submitErrors: getFormSubmitErrors(name)(state),
      dirty: isDirty(name)(state),
      pristine: isPristine(name)(state),
      valid: isValid(name)(state),
      invalid: isInvalid(name)(state),
      submitting: isSubmitting(name)(state),
      submitSucceeded: hasSubmitSucceeded(name)(state),
      submitFailed: hasSubmitFailed(name)(state)
    }
  },
  dispatch =>
    bindActionCreators(
      {
        reset
      },
      dispatch
    )
)(FormControllerContainer)
