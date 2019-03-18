import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Debug from '../../../../Framework/Debug'

import './FormController.scss'

const FormController = ({
  name,
  children,
  handleSubmit,
  handleReset,
  submitSucceeded,
  submitting,
  pristine,
  invalid,
  submitValue,
  resetValue = 'Clear',
  btnWrapperClasses = 'col-xs-12 col-sm-12',
  showButtons = true,
  showReset = true,
  customError,
  values = {},
  buttonsPosition = 'center'
}) => (
  <form
    className={`form ${name}-form`}
    onSubmit={handleSubmit}
    autoComplete="false"
  >
    <Debug data={values} />
    <Debug
      data={{
        btnWrapperClasses,
        buttonsPosition
      }}
    />

    {customError ? (
      <div className="field-container">
        <div className="alert alert-danger" role="alert">
          {customError}
        </div>
      </div>
    ) : null}

    {children}

    {showButtons ? (
      <div className="field-container">
        <div className={`${btnWrapperClasses}`}>
          <div
            className={classNames({
              'pull-left': buttonsPosition === 'left',
              'pull-right': buttonsPosition === 'right',
              'text-center': buttonsPosition === 'center'
            })}
          >
            <button
              className="button submit"
              type="submit"
              disabled={pristine || invalid || submitting}
            >
              {submitValue}
            </button>
            &nbsp;
            {showReset ? (
              <button
                type="button"
                className="button default"
                disabled={pristine || submitting}
                onClick={handleReset}
              >
                {resetValue}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    ) : null}
  </form>
)

FormController.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node,
  handleSubmit: PropTypes.func,
  handleReset: PropTypes.func,
  submitSucceeded: PropTypes.bool,
  submitting: PropTypes.bool,
  pristine: PropTypes.bool,
  invalid: PropTypes.bool,
  submitValue: PropTypes.node,
  resetValue: PropTypes.node,
  btnWrapperClasses: PropTypes.string,
  showButtons: PropTypes.bool,
  customError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  showReset: PropTypes.bool,
  buttonsPosition: PropTypes.string,

  values: PropTypes.object
}

export default FormController
