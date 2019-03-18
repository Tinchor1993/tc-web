import React, { PropTypes } from 'react'

import {
  INPUT,
  PASSWORD,
  EMAIL,
  TEXTAREA,
  SELECT,
  CHECKBOX,
  RADIO
} from '../../Constants/types'

import InputField from './InputField/InputField'
import CheckboxField from './CheckboxField/CheckboxField'
import RadioField from './RadioField/RadioField'
import SelectField from './SelectField/SelectField'
import TextareaField from './TextareaField/TextareaField'

export const Inputs = ({
  type,
  input,
  textarea,
  extra: { meta, customChecked, required, label, options, selectedOption }
}) => {
  const extra = {
    meta,
    customChecked,
    required,
    label,
    options,
    selectedOption,
    textarea
  }

  switch (type) {
    case PASSWORD:
    case INPUT:
    case EMAIL:
      return <InputField type={type} input={input} {...extra} />

    case TEXTAREA:
      return <TextareaField type={type} input={input} {...extra} />

    case SELECT:
      return <SelectField type={type} input={input} {...extra} />

    case CHECKBOX:
      return <CheckboxField type={type} input={input} {...extra} />

    case RADIO:
      return <RadioField type={type} input={input} {...extra} />

    default:
      return (
        <div>
          undefined type: <i>{type}</i>
        </div>
      )
  }
}

Inputs.propTypes = {
  type: PropTypes.string,
  input: PropTypes.object,
  textarea: PropTypes.object,
  label: PropTypes.string,
  required: PropTypes.bool,
  extra: PropTypes.object
}

export default Inputs
