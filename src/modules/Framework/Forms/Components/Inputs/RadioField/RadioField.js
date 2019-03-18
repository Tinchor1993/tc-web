import React, { PropTypes } from 'react'

export const RadioField = ({
  input,
  label,
  required,
  customChecked,
  meta: { touched, error, warning, invalid }
}) => (
  <label>
    <input
      type="radio"
      {...input}
      checked={customChecked}
      className={`${touched && invalid ? 'has-danger' : ''}`}
    />
    {label} {required ? <span className="required">*</span> : null}
  </label>
)

RadioField.propTypes = {
  input: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  customChecked: PropTypes.bool,
  meta: PropTypes.object
}

export default RadioField
