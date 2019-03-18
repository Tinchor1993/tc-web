import getSelectedRows from './getSelectedRows'
import filter from 'lodash/filter'

export const changeRowSelection = (state, name, { id }, selection) => {
  const selectedRows = getSelectedRows(state, name)
  let nextSelelectedRows = [...selectedRows]

  if (selection) {
    nextSelelectedRows.push(id)
  } else {
    nextSelelectedRows = filter(nextSelelectedRows, rowId => rowId !== id)
  }

  return {
    ...state,
    [name]: {
      ...state[name],
      selectedRows: nextSelelectedRows
    }
  }
}

export default getSelectedRows
