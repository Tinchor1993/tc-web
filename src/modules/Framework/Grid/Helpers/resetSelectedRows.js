export const resetSelectedRows = (state, name) => {
  return {
    ...state,
    [name]: {
      ...state[name],
      selectedRows: []
    }
  }
}

export default resetSelectedRows
