const min = minVal => (value, previousValue) =>
  value >= minVal ? value : previousValue
export default min
