export default (text='', nullText = '') => {
  const ltext = text.toLowerCase()
  if (ltext === 'null') text = nullText
  
  return text
}
