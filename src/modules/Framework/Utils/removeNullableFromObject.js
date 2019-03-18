import merge from 'lodash/merge'

export const removeNullableFromObject = o => {
  const obj = merge({}, o)

  Object.keys(obj).forEach(function(k) {
    if (!obj[k]) {
      delete obj[k]
    }
  })

  return obj
}

export default removeNullableFromObject
