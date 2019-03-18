import isString from 'lodash/isString'

import VatValidator from '../../../../Validation/VatValidator/VatValidator'
import SSNValidator from '../../../../Validation/SSNValidator/SSNValidator'

const DataTypesExampleFormValidator = values => {
  const errors = {}

  if (!values.vat) {
    errors.vat = 'Invalid format'
  } else {
    const vatValidationResult = VatValidator(values.vat)
    if (isString(vatValidationResult)) {
      errors.vat = vatValidationResult
    }
  }

  if (!values.ssn) {
    errors.ssn = 'Invalid format'
  } else {
    const ssnValidationResult = SSNValidator(values.ssn)
    if (isString(ssnValidationResult)) {
      errors.ssn = ssnValidationResult
    }
  }

  return errors
}

export default DataTypesExampleFormValidator
