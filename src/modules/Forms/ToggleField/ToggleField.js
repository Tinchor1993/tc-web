import React, { Component } from 'react'
import { noop, isEmpty, isBool } from 'lodash'

import './ToggleField.scss'
const ToggleField = ({
  input: { value, onBlur = noop, onChange = noop },
  options,
  ...props
}) => (
  <label className="switch">
    <input
      type="checkbox"
      onBlur={() => {
        onBlur(value)
      }}
      onChange={e => {
        ;``
        onChange(e.target.checked)
      }}
      defaultChecked={value}
      {...props}
    />
    <span className="slider round" />
  </label>
)

export default ToggleField
