import { fromJS, Map, List } from 'immutable'
import { many, single } from '../../../helpers/redux'

import {
  GET_SUBJECTS_LIST_REQUEST,
  GET_SUBJECTS_LIST_SUCCESS,
  GET_SUBJECTS_LIST_FAIL,
  GET_SINGLE_SUBJECT_REQUEST,
  GET_SINGLE_SUBJECT_SUCCESS,
  GET_SINGLE_SUBJECT_FAIL,
  CREATE_SUBJECT_REQUEST,
  CREATE_SUBJECT_SUCCESS,
  CREATE_SUBJECT_FAIL,
  DELETE_SUBJECT_REQUEST,
  DELETE_SUBJECT_SUCCESS,
  UPDATE_SUBJECT_REQUEST,
  UPDATE_SUBJECT_SUCCESS,
  UPDATE_SUBJECT_FAIL
} from '../Actions/SubjectsActions'

const defaultState = {
  grid: many({
    list: []
  }),
  active: single({
    loading: false,
    current: {}
  })
}

const initalState = fromJS(defaultState)

export default function SubjectReducer(state = initalState, action) {
  switch (action.type) {
    case GET_SUBJECTS_LIST_REQUEST:
      state = state.setIn(['grid', 'loading'], true)
      return state

    case GET_SUBJECTS_LIST_SUCCESS:
      state = state.setIn(['grid', 'list'], List(action.payload.data))
      state = state.setIn(['grid', 'loaded'], true)
      state = state.setIn(['grid', 'loading'], false)
      state = state.setIn(['grid', 'error'], null)
      return state

    case GET_SUBJECTS_LIST_FAIL:
      state = state.setIn(['grid', 'error'], action.payload.error)
      return state

    case GET_SINGLE_SUBJECT_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state

    case GET_SINGLE_SUBJECT_SUCCESS:
      state = state.setIn(['active', 'current'], fromJS(action.payload.data))
      state = state.setIn(['active', 'loaded'], true)
      state = state.setIn(['active', 'loading'], false)
      state = state.setIn(['active', 'error'], null)
      return state

    case GET_SINGLE_SUBJECT_FAIL:
      state = state.setIn(['active', 'error'], action.payload.error)
      return state
    case DELETE_SUBJECT_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state
    case DELETE_SUBJECT_SUCCESS:
      state = state.setIn(['active', 'loading'], false)
      return state

    default:
      return state
  }
}
