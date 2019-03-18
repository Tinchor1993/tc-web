import { fromJS, Map, List } from 'immutable'
import { many, single } from '../../../helpers/redux'

import {
  GET_STUDENTS_LIST_REQUEST,
  GET_STUDENTS_LIST_SUCCESS,
  GET_STUDENTS_LIST_FAIL,
  GET_SINGLE_STUDENT_REQUEST,
  GET_SINGLE_STUDENT_SUCCESS,
  GET_SINGLE_STUDENT_FAIL,
  CREATE_STUDENT_REQUEST,
  CREATE_STUDENT_SUCCESS,
  CREATE_STUDENT_FAIL,
  UPDATE_STUDENT_REQUEST,
  UPDATE_STUDENT_SUCCESS,
  UPDATE_STUDENT_FAIL,
  DELETE_STUDENT_REQUEST,
  DELETE_STUDENT_SUCCESS,
  DELETE_STUDENT_FAIL
} from '../Actions/StudentsActions'

const defaultState = {
  grid: many({
    list: []
  }),
  columns: [
    {
      header: 'Student',
      accessor: 'fullName'
    },
    {
      header: 'Email',
      accessor: 'email'
    },
    {
      header: 'Status',
      accessor: 'active'
    }
  ],
  active: single({
    loading: false,
    current: {}
  })
}

const initalState = fromJS(defaultState)

export default function StudentsReducers(state = initalState, action) {
  switch (action.type) {
    case GET_STUDENTS_LIST_REQUEST:
      state = state.setIn(['grid', 'loading'], true)
      return state

    case GET_STUDENTS_LIST_SUCCESS:
      state = state.setIn(['grid', 'list'], List(action.payload.data))
      state = state.setIn(['grid', 'loaded'], true)
      state = state.setIn(['grid', 'loading'], false)
      state = state.setIn(['grid', 'error'], null)
      return state

    case GET_STUDENTS_LIST_FAIL:
      state = state.setIn(['grid', 'error'], action.payload.error)
      return state

    case GET_SINGLE_STUDENT_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state

    case GET_SINGLE_STUDENT_SUCCESS:
      state = state.setIn(['active', 'current'], fromJS(action.payload.data))
      state = state.setIn(['active', 'loaded'], true)
      state = state.setIn(['active', 'loading'], false)
      state = state.setIn(['active', 'error'], null)
      return state

    case GET_SINGLE_STUDENT_FAIL:
      state = state.setIn(['active', 'error'], action.payload.error)
      return state

    default:
      return state
  }
}
