/**
 * Created by looch on 29/07/2017.
 */
import { fromJS, Map, List } from 'immutable'
import { many } from '../../../helpers/redux'
import {
  GET_LEVELS_LIST_REQUEST,
  GET_LEVELS_LIST_SUCCESS,
  GET_LEVELS_LIST_FAIL
} from '../Actions/LevelsActions'

const defaultState = {
  grid: many({
    list: []
  })
}

const initalState = fromJS(defaultState)
export default function LevelsReducer(state = initalState, action) {
  switch (action.type) {
    case GET_LEVELS_LIST_REQUEST:
      state = state.setIn(['grid', 'loading'], true)
      return state

    case GET_LEVELS_LIST_SUCCESS:
      state = state.setIn(['grid', 'list'], List(action.payload.data))
      state = state.setIn(['grid', 'loaded'], true)
      state = state.setIn(['grid', 'loading'], false)
      state = state.setIn(['grid', 'error'], null)
      return state

    case GET_LEVELS_LIST_FAIL:
      state = state.setIn(['grid', 'error'], action.payload.error)
      return state

    default:
      return state
  }
}
