import React, { PropTypes } from 'react'

import Select from 'react-select'
import Debug from '../../../../Debug'

export const SelectField = props => (
  <Select
    {...props.input}
    valueKey="id"
    labelKey="label"
    value={props.selectedOption ? props.selectedOption : props.input.value}
    onChange={item => props.input.onChange(item !== null ? item.id : null)}
    onBlur={() => props.input.onBlur(props.input.value)}
    options={props.options}
  />
)

SelectField.propTypes = {
  input: PropTypes.object,
  options: PropTypes.array,
  required: PropTypes.bool,
  selectedOption: PropTypes.string
}

export default SelectField
