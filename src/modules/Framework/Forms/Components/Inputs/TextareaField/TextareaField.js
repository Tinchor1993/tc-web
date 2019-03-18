import React, { PropTypes } from 'react'

export const TextareaField = ({
  input,
  textarea,
  placeholder,
  type,
  inputWrapperStyles,
  meta: { touched, error, warning, invalid }
}) => (
  <div>
    <textarea
      {...input}
      placeholder={placeholder}
      {...textarea}
      type={type}
      className={`${touched && invalid ? 'has-danger' : ''}`}
    />
  </div>
)

TextareaField.propTypes = {
  input: PropTypes.object.isRequired,
  textarea: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  inputWrapperStyles: PropTypes.string,
  meta: PropTypes.object
}

export default TextareaField
