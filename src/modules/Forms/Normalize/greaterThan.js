const greaterThan = otherField => (value, previousValue, allValues) =>
  value > allValues[otherField] ? value : previousValue
export default greaterThan
