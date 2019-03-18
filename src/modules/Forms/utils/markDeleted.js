import { autofill } from 'redux-form'

const markDeleted = (form, arrayName, index, v) => {
  const field = `${arrayName}[${index}].isDeleted`
  return autofill(form, field, v)
}

export default markDeleted
