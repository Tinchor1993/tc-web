import React, { PropTypes } from 'react'

const CheckboxField = ({
  input,
  label,
  required,
  customChecked,
  meta: { touched, error, warning, invalid }
}) => (
  <label>
    <input
      type="checkbox"
      {...input}
      checked={customChecked}
      className={`${touched && invalid ? 'has-danger' : ''}`}
    />
    {label} {required ? <span className="required">*</span> : null}
  </label>
)

CheckboxField.propTypes = {
  input: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  customChecked: PropTypes.bool,
  meta: PropTypes.object
}

export default CheckboxField
