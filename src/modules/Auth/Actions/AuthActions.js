import { push } from 'react-router-redux'
import { reset } from 'redux-form'

import Request from '../../Framework/API/Request'

const AUTH_ENDPOINT = `/api/v1/auth/admin`

const LOGIN_FORM_KEY = `login`

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAIL = 'LOGIN_FAIL'

export const LOGOUT = 'LOGOUT'

export const login = credentials => {
  return dispatch => {
    dispatch(loginRequest(credentials))

    Request.post(`${AUTH_ENDPOINT}/`, credentials)
      .then(res => res.data)
      .then(data => {
        const { success } = data

        if (success) {
          dispatch(loginSuccess(data))
          dispatch(reset(LOGIN_FORM_KEY))
          dispatch(push(`/dashboard/subjects`))
        } else {
          dispatch(loginFail(data.message))
        }
      })
      .catch(err => {
        dispatch(loginFail(err))
      })
  }
}

export const loginRequest = (login, password) => {
  return {
    type: LOGIN_REQUEST,
    payload: {
      login,
      password
    }
  }
}

export const loginSuccess = data => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      data
    }
  }
}

export const loginFail = error => {
  return {
    type: LOGIN_FAIL,
    payload: {
      error
    }
  }
}

export const logout = () => {
  return dispatch => {
    dispatch(push(`/dashboard/login`))
    dispatch({ type: LOGOUT })
  }
}
