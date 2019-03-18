import { fromJS, Map, List } from 'immutable'
import { many, single } from '../../../helpers/redux'

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../Actions/AuthActions'

const storage = localStorage
const USER_KEY = 'user'

const login = user => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const getUser = () => {
  const user = localStorage.getItem(USER_KEY)

  return user || null
}

const logout = () => {
  localStorage.removeItem(USER_KEY)
}

const userData = getUser()

const defaultState = {
  loading: null,
  error: null,
  loggedIn: !!userData,
  user: userData
}

const initalState = fromJS(defaultState)

export default function AuthReducer(state = initalState, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      state = state.setIn(['loading'], true)
      state = state.setIn(['loggedIn'], false)
      logout()
      return state

    case LOGIN_SUCCESS:
      state = state.setIn(['loading'], true)
      state = state.setIn(['loggedIn'], true)
      login(action.payload.data.user)
      return state

    case LOGIN_FAIL:
      state = state.setIn(['error'], action.payload.error)
      state = state.setIn(['loggedIn'], true)
      state = state.setIn(['loading'], false)
      logout()
      return state

    case LOGOUT:
      state = state.setIn(['loggedIn'], false)
      logout()
      return state

    default:
      return state
  }
}
