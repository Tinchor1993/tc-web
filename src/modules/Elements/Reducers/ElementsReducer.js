import { fromJS, Map, List } from 'immutable'
import { many, single } from '../../../helpers/redux'

import {
  GET_ELEMENTS_LIST_REQUEST,
  GET_ELEMENTS_LIST_SUCCESS,
  GET_ELEMENTS_LIST_FAIL,
  DELETE_ELEMENT_REQUEST,
  DELETE_ELEMENT_SUCCESS,
  GET_SINGLE_ELEMENT_REQUEST,
  GET_SINGLE_ELEMENT_SUCCESS,
  GET_SINGLE_ELEMENT_FAIL,
  GET_FOLDERS_SUCCESS,
  GET_FOLDERS_FAIL,
  CHANGE_FOLDER,
  DELETE_FOLDER_REQUEST,
  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_FAIL
} from '../Actions/ElementListActions'

const defaultState = {
  grid: many({
    list: []
  }),
  folders: {
    data: many({
      list: []
    }),
    active: 'ALL'
  },
  active: single({
    loading: false,
    current: {}
  })
}

const initalState = fromJS(defaultState)

export default function ElementsReducer(state = initalState, action) {
  switch (action.type) {
    case GET_ELEMENTS_LIST_REQUEST:
      state = state.setIn(['grid', 'loading'], true)
      return state

    case GET_ELEMENTS_LIST_SUCCESS:
      state = state.setIn(['grid', 'list'], List(action.payload.data))
      state = state.setIn(['grid', 'loaded'], true)
      state = state.setIn(['grid', 'loading'], false)
      state = state.setIn(['grid', 'error'], null)
      return state

    case GET_ELEMENTS_LIST_FAIL:
      state = state.setIn(['grid', 'error'], action.payload.error)
      return state

    case GET_SINGLE_ELEMENT_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state

    case GET_SINGLE_ELEMENT_SUCCESS:
      state = state.setIn(['active', 'current'], fromJS(action.payload.data))
      state = state.setIn(['active', 'loaded'], true)
      state = state.setIn(['active', 'loading'], false)
      state = state.setIn(['active', 'error'], null)
      return state

    case GET_SINGLE_ELEMENT_FAIL:
      state = state.setIn(['active', 'error'], action.payload.error)
      return state
    case DELETE_ELEMENT_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state
    case DELETE_ELEMENT_SUCCESS:
      state = state.setIn(['active', 'loading'], false)
      return state
    case GET_FOLDERS_SUCCESS:
      state = state.setIn(
        ['folders', 'data', 'list'],
        List(action.payload.data)
      )
      return state
    case GET_FOLDERS_FAIL:
      state = state.setIn(['grid', 'data', 'error'], action.payload.error)
      return state
    case CHANGE_FOLDER:
      state = state.setIn(['folders', 'active'], action.payload.activeFolder)
      return state
    case DELETE_FOLDER_REQUEST:
      state = state.updateIn(['folders', 'data', 'list'], l =>
        l.filter(({ id }) => id !== action.payload.id)
      )
      state = state.setIn(['folders', 'active'], 'ALL')
      return state

    default:
      return state
  }
}
