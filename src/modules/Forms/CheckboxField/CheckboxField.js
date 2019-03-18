import React, { Component } from 'react'
import { noop, isEmpty, isBool } from 'lodash'
import ReactSelect from 'react-select'

import Request from '../../Framework/API/Request'

import './CheckboxField.scss'

const CheckboxField = ({
  input: { value, onBlur = noop, onChange = noop },
  options,
  ...props
}) => (
  <input
    type="checkbox"
    onBlur={() => {
      onBlur(value)
    }}
    onChange={e => {
      onChange(e.target.checked)
    }}
    defaultChecked={value}
    {...props}
  />
)

export default CheckboxField
