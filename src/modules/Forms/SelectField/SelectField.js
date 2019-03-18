import React, { Component } from 'react'
import { noop, isEmpty } from 'lodash'
import ReactSelect from 'react-select'

import Request from '../../Framework/API/Request'

import './SelectField.scss'

const SelectField = ({
  input: { value, onBlur = noop, onChange = noop },
  options,
  defaultValue,
  ...props
}) => (
  <div>
    <ReactSelect
      value={value}
      onBlur={changeValue => {
        console.dir(changeValue)
        onBlur(changeValue.value)
      }}
      onChange={changeValue => {
        console.dir(changeValue)
        onChange(changeValue.value)
      }}
      options={options}
      ignoreCase
      {...props}
    />
  </div>
)

export default SelectField
