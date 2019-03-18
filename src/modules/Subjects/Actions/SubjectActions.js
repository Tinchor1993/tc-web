import many from '../../../helpers/actions/many'

import Request from '../../Framework/API/Request'

const SUBJECTS_ENDPOINT = `/api/v1/subjects`

export const GET_SUBJECTS_REQUEST = 'GET_SUBJECTS_REQUEST'
export const GET_SUBJECTS_SUCCESS = 'GET_SUBJECTS_SUCCESS'
export const GET_SUBJECTS_FAIL = 'GET_SUBJECTS_FAIL'

export const { getAll } = many('subjects', {
  endpoint: '/subjects'
})

export const getList = meta => {
  return dispatch => {
    dispatch(getListRequest())

    Request.get(SUBJECTS_ENDPOINT)
      .then(res => res.data)
      .then(data => {
        dispatch(getListSuccess(data))
      })
      .catch(err => {
        dispatch(getListFailed(err))
      })
  }
}

export const getListRequest = meta => {
  return {
    type: GET_SUBJECTS_REQUEST,
    payload: {
      meta
    }
  }
}

export const getListSuccess = data => {
  return {
    type: GET_SUBJECTS_SUCCESS,
    payload: {
      data
    }
  }
}

export const getListFailed = error => {
  return {
    type: GET_SUBJECTS_SUCCESS,
    payload: {
      error
    }
  }
}
