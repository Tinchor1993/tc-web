import React from 'react'

import './Field.scss'
import Inputs from '../Inputs'

export const renderField = ({
  input,
  label,
  type,
  textarea,
  placeholder,
  required,
  meta: { touched, error, warning, invalid },
  fieldWrapperClasses = '',
  labelWrapperClasses = '',
  inputWrapperClasses = '',
  customChecked = null,
  options,
  selectedOption = ''
}) => {
  const radio = type === 'radio'
  const checkbox = type === 'checkbox'
  const select = type === 'select'

  const extra = {
    meta: { touched, error, warning, invalid },
    customChecked,
    label,
    textarea,
    required,
    options,
    selectedOption
  }

  if (radio || checkbox) {
    return (
      <div className={`field-container ${fieldWrapperClasses}`}>
        <div className={`field-radio radio ${inputWrapperClasses}`}>
          <Inputs type={type} input={input} extra={extra} />
        </div>
        <p className="error-message">
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </p>
      </div>
    )
  }

  return (
    <div className={`field-container ${fieldWrapperClasses}`}>
      <div className={`field-label ${labelWrapperClasses}`}>
        {label}&nbsp;{required ? <span className="required">*</span> : null}
      </div>
      <div className={`field-input ${inputWrapperClasses}`}>
        <Inputs type={type} input={input} extra={extra} />

        <p className="error-message">
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </p>
      </div>
    </div>
  )
}

export default renderField
