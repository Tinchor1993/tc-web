const ACTIONS_PREFIX = '@GRID'

export const REGISTER = `${ACTIONS_PREFIX}/REGISTER`
export const SET_READ_MODE = `${ACTIONS_PREFIX}/SET_READ_MODE`

export const SELECT_ALL = `${ACTIONS_PREFIX}/SELECT_ALL`
export const UNSELECT_ALL = `${ACTIONS_PREFIX}/UNSELECT_ALL`

export const SELECT_ROW = `${ACTIONS_PREFIX}/SELECT_ROW`
export const UNSELECT_ROW = `${ACTIONS_PREFIX}/UNSELECT_ROW`

export function register(name, config = {}) {
  return {
    type: REGISTER,
    payload: {
      name,
      config
    }
  }
}

export function setReadMode(mode) {
  return {
    type: SET_READ_MODE,
    payload: {
      name,
      mode
    }
  }
}

export function selectAll(name) {
  return {
    type: SELECT_ALL,
    payload: {
      name
    }
  }
}

export function unselectAll(name) {
  return {
    type: UNSELECT_ALL,
    payload: {
      name
    }
  }
}

export function selectRow(name, row) {
  return {
    type: SELECT_ROW,
    payload: {
      name,
      row
    }
  }
}

export function unselectRow(name, row) {
  return {
    type: UNSELECT_ROW,
    payload: {
      name,
      row
    }
  }
}
