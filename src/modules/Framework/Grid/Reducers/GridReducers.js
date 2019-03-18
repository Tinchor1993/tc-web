import {
  REGISTER,
  SET_READ_MODE,
  SELECT_ALL,
  UNSELECT_ALL,
  SELECT_ROW,
  UNSELECT_ROW
} from '../Actions/GridActions'
import { registerGrid, changeRowSelection, resetSelectedRows } from '../Helpers'

const initialState = {}

export default function GridReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER:
      state = registerGrid(state, action.payload.name, action.payload.config)
      return state

    case SELECT_ROW:
      state = changeRowSelection(
        state,
        action.payload.name,
        action.payload.row,
        true
      )
      return state

    case UNSELECT_ROW:
      state = changeRowSelection(
        state,
        action.payload.name,
        action.payload.row,
        false
      )
      return state

    case UNSELECT_ALL:
      state = resetSelectedRows(state, action.payload.name)
      return state

    default:
      return state
  }
}
