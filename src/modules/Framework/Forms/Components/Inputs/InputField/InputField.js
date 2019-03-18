import React, { PropTypes } from 'react'

export const InputField = ({
  input,
  placeholder,
  type,
  meta: { touched, error, warning, invalid }
}) => (
  <div>
    <input
      {...input}
      placeholder={placeholder}
      type={type}
      className={`${touched && invalid ? 'has-danger' : ''}`}
    />
  </div>
)

InputField.propTypes = {
  input: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object
}

export default InputField
