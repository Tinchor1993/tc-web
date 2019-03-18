import getGridFromState from './getGridFromState'

export const getSelectedRows = (state, name) => {
  const grid = getGridFromState(state, name)
  if (!grid) return []
  return grid.selectedRows
}

export default getSelectedRows
