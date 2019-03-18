/**
 * Created by looch on 29/07/2017.
 */

import Request from '../../Framework/API/Request'
const LEVELS_ENDPOINT = `/api/v1/lessons`
export const GET_LEVELS_LIST_REQUEST = 'GET_LEVELS_LIST_REQUEST'
export const GET_LEVELS_LIST_SUCCESS = 'GET_LEVELS_LIST_SUCCESS'
export const GET_LEVELS_LIST_FAIL = 'GET_LEVELS_LIST_FAIL'

export const getList = meta => {
  return dispatch => {
    dispatch(getListRequest())

    Request.get(`${LEVELS_ENDPOINT}/`)
      .then(res => res.data)
      .then(data => {
        dispatch(getListSuccess(data))
      })
      .catch(err => {
        dispatch(getListFailed(err))
      })
  }
}

export const updateLevel = levelsData => {
  return dispatch => {
    // dispatch(upadateLevelRequest());

    Request.put(`/api/v1/levels`, levelsData)
      .then(res => res.data)
      .then(data => {
        // dispatch(upadateLevelSuccess(data))
      })
      .catch(err => {
        // dispatch(upadateLevelFailed(err))
      })
  }
}
export const getListRequest = meta => {
  return {
    type: GET_LEVELS_LIST_REQUEST,
    payload: {
      meta
    }
  }
}

export const getListSuccess = data => {
  return {
    type: GET_LEVELS_LIST_SUCCESS,
    payload: {
      data
    }
  }
}

export const getListFailed = error => {
  return {
    type: GET_LEVELS_LIST_SUCCESS,
    payload: {
      error
    }
  }
}
