import { fromJS, Map, List } from 'immutable'
import { many, single } from '../../../helpers/redux'

import {
  GET_STATISTIC_LIST_REQUEST,
  GET_STATISTIC_LIST_SUCCESS,
  GET_STATISTIC_LIST_FAIL,
  GET_SINGLE_STATISTIC_REQUEST,
  GET_SINGLE_STATISTIC_SUCCESS,
  GET_SINGLE_STATISTIC_FAIL,
  CREATE_STATISTIC_REQUEST,
  CREATE_STATISTIC_SUCCESS,
  CREATE_STATISTIC_FAIL,
  UPDATE_STATISTIC_REQUEST,
  UPDATE_STATISTIC_SUCCESS,
  UPDATE_STATISTIC_FAIL,
  DELETE_STATISTIC_REQUEST,
  DELETE_STATISTIC_SUCCESS,
  DELETE_STATISTIC_FAIL
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
    }
  ],
  active: single({
    loading: false,
    current: {}
  })
}

const initalState = fromJS(defaultState)

export default function StatisticReducers(state = initalState, action) {
  switch (action.type) {
    case GET_STATISTIC_LIST_REQUEST:
      state = state.setIn(['grid', 'loading'], true)
      return state

    case GET_STATISTIC_LIST_SUCCESS:
      state = state.setIn(['grid', 'list'], List(action.payload.data))
      state = state.setIn(['grid', 'loaded'], true)
      state = state.setIn(['grid', 'loading'], false)
      state = state.setIn(['grid', 'error'], null)
      return state

    case GET_STATISTIC_LIST_FAIL:
      state = state.setIn(['grid', 'error'], action.payload.error)
      return state

    case GET_SINGLE_STATISTIC_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state

    case GET_SINGLE_STATISTIC_SUCCESS:
      state = state.setIn(['active', 'current'], fromJS(action.payload.data))
      state = state.setIn(['active', 'loaded'], true)
      state = state.setIn(['active', 'loading'], false)
      state = state.setIn(['active', 'error'], null)
      return state

    case GET_SINGLE_STATISTIC_FAIL:
      state = state.setIn(['active', 'error'], action.payload.error)
      return state

    default:
      return state
  }
}
