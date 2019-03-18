import { isObject, isArray, isEmpty } from 'lodash'

const STR_NULL = 'null'

const prettyVal = val => (isEmpty(val) ? STR_NULL : val)

const normalizeEmpty = obj => {
  let result = isArray(obj) ? [] : {}

  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (isArray(obj[p])) {
        result[p] = [...obj[p].map(normalizeEmpty)]
      } else if (isObject(obj[p])) {
        result[p] = normalizeEmpty(obj[p])
      } else {
        result[p] = prettyVal(obj[p])
      }
    }
  }

  return result
}

export default normalizeEmpty
