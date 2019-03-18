import { fromJS, Map, List } from 'immutable'
import { many, single } from '../../../helpers/redux'

import {
  CREATE_LESSON_WIZARD_SET_STEP,
  GET_LESSONS_LIST_REQUEST,
  GET_LESSONS_LIST_SUCCESS,
  GET_LESSONS_LIST_FAIL,
  SET_LESSON_DATA,
  CREATE_LESSON_REQUEST,
  CREATE_LESSON_SUCCESS,
  CREATE_LESSON_FAIL,
  GET_SINGLE_LESSON_REQUEST,
  GET_SINGLE_LESSON_SUCCESS,
  GET_SINGLE_LESSON_FAIL,
  DELETE_LESSON_REQUEST,
  DELETE_LESSON_SUCCESS,
  UPDATE_LESSON_REQUEST,
  UPDATE_LESSON_SUCCESS,
  UPDATE_LESSON_FAIL,
  SET_ACTIVE_SLIDE,
  APPLY_TO_SLIDE,
  APPLY_TO_ALL_SLIDES
} from '../Actions/LessonsActions'

const defaultState = {
  counter: 0,
  grid: many({
    list: []
  }),
  active: single({
    current: {
      title: 'Loading...'
    }
  }),
  creation: {
    loading: false,
    activeStep: '',
    activeSlideIndex: 0
  }
}

const initalState = fromJS(defaultState)

export default function LessonsReducer(state = initalState, action) {
  switch (action.type) {
    case CREATE_LESSON_WIZARD_SET_STEP:
      state = state.setIn(['creation', 'activeStep'], action.payload.step)
      return state

    case GET_LESSONS_LIST_REQUEST:
      state = state.setIn(['grid', 'loading'], true)
      return state

    case GET_LESSONS_LIST_SUCCESS:
      state = state.setIn(['grid', 'list'], List(action.payload.data))
      state = state.setIn(['grid', 'loaded'], true)
      state = state.setIn(['grid', 'loading'], false)
      state = state.setIn(['grid', 'error'], null)
      return state

    case GET_LESSONS_LIST_FAIL:
      state = state.setIn(['grid', 'error'], action.payload.error)
      return state

    case SET_LESSON_DATA:
      state = state.setIn(
        ['active', 'current', action.payload.part],
        fromJS(action.payload.data)
      )
      return state

    case GET_SINGLE_LESSON_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state

    case GET_SINGLE_LESSON_SUCCESS:
      state = state.setIn(['active', 'current'], fromJS(action.payload.data))
      state = state.setIn(['active', 'loaded'], true)
      state = state.setIn(['active', 'loading'], false)
      state = state.setIn(['active', 'error'], null)
      return state

    case GET_SINGLE_LESSON_FAIL:
      state = state.setIn(['active', 'error'], action.payload.error)
      return state

    case UPDATE_LESSON_REQUEST:
    case CREATE_LESSON_REQUEST:
      state = state.setIn(['creation', 'loading'], true)
      return state

    case UPDATE_LESSON_SUCCESS:
    case CREATE_LESSON_SUCCESS:
      state = state.setIn(['active', 'current'], fromJS(action.payload.data))
      state = state.setIn(['active', 'loaded'], true)
      state = state.setIn(['active', 'loading'], false)
      state = state.setIn(['creation', 'loading'], false)
      state = state.setIn(['active', 'error'], null)
      return state

    case UPDATE_LESSON_FAIL:
    case CREATE_LESSON_FAIL:
      state = state.setIn(['active', 'error'], action.payload.error)
      return state

    case DELETE_LESSON_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state

    case DELETE_LESSON_SUCCESS:
      state = state.setIn(['active', 'loading'], false)
      return state

    // slides
    case SET_ACTIVE_SLIDE:
      state = state.setIn(
        ['creation', 'activeSlideIndex'],
        action.payload.index
      )
      return state

    case APPLY_TO_SLIDE:
      // state = state.setIn('')
      return state

    case APPLY_TO_ALL_SLIDES:
      // state = state.setIn('')
      return state

    default:
      return state
  }
}
