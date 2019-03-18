import { isObject, isArray } from 'lodash'

const STR_NULL = 'null'

const prettyVal = val => (val === STR_NULL ? null : val)

const prettyValues = obj => {
  let result = isArray(obj) ? [] : {}

  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (isArray(obj[p])) {
        result[p] = [...obj[p].map(prettyValues)]
      } else if (isObject(obj[p])) {
        result[p] = obj[p]
      } else {
        result[p] = obj[p]
      }
    }
  }

  return result
}

export default prettyValues
