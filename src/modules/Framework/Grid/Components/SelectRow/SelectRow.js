import React, { PropTypes } from 'react'

const dummyChangeCheck = () => {}

export const SelectRow = ({ row, onChange, checked }) => (
  <div className="row-selector" onClick={e => onChange(row, !checked, e)}>
    <input
      type="checkbox"
      value="None"
      id={row.id}
      name="check"
      checked={checked}
      onChange={dummyChangeCheck}
    />
    <label htmlFor={row.id} />
  </div>
)

SelectRow.propTypes = {
  row: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  checked: PropTypes.bool
}

export default SelectRow
