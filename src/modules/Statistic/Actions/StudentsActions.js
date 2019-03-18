import many from '../../../helpers/actions/many'
import { push } from 'react-router-redux'
import { reset } from 'redux-form'

import Request from '../../Framework/API/Request'

const SUBJECTS_ENDPOINT = `/api/v1/statistic`

const EDIT_FORM_KEY = `editStatistic`

export const GET_STATISTIC_LIST_REQUEST = 'GET_STATISTIC_LIST_REQUEST'
export const GET_STATISTIC_LIST_SUCCESS = 'GET_STATISTIC_LIST_SUCCESS'
export const GET_STATISTIC_LIST_FAIL = 'GET_STATISTIC_LIST_FAIL'
export const GET_SINGLE_STATISTIC_REQUEST = 'GET_SINGLE_STATISTIC_REQUEST'
export const GET_SINGLE_STATISTIC_SUCCESS = 'GET_SINGLE_STATISTIC_SUCCESS'
export const GET_SINGLE_STATISTIC_FAIL = 'GET_SINGLE_STATISTIC_FAIL'
export const CREATE_STATISTIC_REQUEST = 'CREATE_STATISTIC_REQUEST'
export const CREATE_STATISTIC_SUCCESS = 'CREATE_STATISTIC_SUCCESS'
export const CREATE_STATISTIC_FAIL = 'CREATE_STATISTIC_FAIL'
export const UPDATE_STATISTIC_REQUEST = 'UPDATE_STATISTIC_REQUEST'
export const UPDATE_STATISTIC_SUCCESS = 'UPDATE_STATISTIC_SUCCESS'
export const UPDATE_STATISTIC_FAIL = 'UPDATE_STATISTIC_FAIL'
export const DELETE_STATISTIC_REQUEST = 'DELETE_STATISTIC_REQUEST'
export const DELETE_STATISTIC_SUCCESS = 'DELETE_STATISTIC_SUCCESS'
export const DELETE_STATISTIC_FAIL = 'DELETE_STATISTIC_FAIL'

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
    type: GET_STATISTIC_LIST_REQUEST,
    payload: {
      meta
    }
  }
}

export const getListSuccess = data => {
  return {
    type: GET_STATISTIC_LIST_SUCCESS,
    payload: {
      data
    }
  }
}

export const getListFailed = error => {
  return {
    type: GET_STATISTIC_LIST_FAIL,
    payload: {
      error
    }
  }
}

export const getSingle = id => {
  return dispatch => {
    dispatch(getSingleRequest())

    Request.get(`${SUBJECTS_ENDPOINT}/${id}`)
      .then(res => res.data)
      .then(data => {
        dispatch(getSingleSuccess(data))
      })
      .catch(err => {
        dispatch(getSingleFailed(err))
      })
  }
}

export const getSingleRequest = id => {
  return {
    type: GET_SINGLE_STATISTIC_REQUEST,
    payload: {
      id
    }
  }
}

export const getSingleSuccess = data => {
  return {
    type: GET_SINGLE_STATISTIC_SUCCESS,
    payload: {
      data
    }
  }
}

export const getSingleFailed = error => {
  return {
    type: GET_SINGLE_STATISTIC_FAIL,
    payload: {
      error
    }
  }
}

export const create = subjectData => {
  return dispatch => {
    dispatch(createRequest(subjectData))

    Request.post(`${SUBJECTS_ENDPOINT}/`, subjectData)
      .then(res => res.data)
      .then(data => {
        dispatch(createSuccess(data))
        dispatch(reset(INVITE_FORM_KEY))
        dispatch(push(`/dashboard/students/${data.id}`))
      })
      .catch(err => {
        dispatch(createFail(err))
      })
  }
}

export const createRequest = data => {
  return {
    type: CREATE_STATISTIC_REQUEST,
    payload: {
      data
    }
  }
}

export const createSuccess = data => {
  return {
    type: CREATE_STATISTIC_SUCCESS,
    payload: {
      data
    }
  }
}

export const createFail = error => {
  return {
    type: CREATE_STATISTIC_FAIL,
    payload: {
      error
    }
  }
}

export const update = (id, subjectData) => {
  return dispatch => {
    dispatch(updateRequest(id, subjectData))

    Request.put(`${SUBJECTS_ENDPOINT}/${id}`, subjectData)
      .then(res => res.data)
      .then(data => {
        dispatch(updateSuccess(data))
        dispatch(reset(EDIT_FORM_KEY))
        dispatch(push(`/dashboard/students/${data.id}`))
      })
      .catch(err => {
        dispatch(updateFail(err))
      })
  }
}

export const updateRequest = (id, data) => {
  return {
    type: UPDATE_STATISTIC_REQUEST,
    payload: {
      id,
      data
    }
  }
}

export const updateSuccess = data => {
  return {
    type: UPDATE_STATISTIC_SUCCESS,
    payload: {
      data
    }
  }
}

export const updateFail = error => {
  return {
    type: UPDATE_STATISTIC_FAIL,
    payload: {
      error
    }
  }
}

export const remove = id => {
  return dispatch => {
    dispatch(removeRequest(id))

    Request.delete(`${SUBJECTS_ENDPOINT}/${id}`)
      .then(res => res.data)
      .then(data => {
        dispatch(removeSuccess(data))
        dispatch(push(`/dashboard/subjects`))
      })
      .catch(err => {
        dispatch(removeFail(err))
      })
  }
}

export const removeRequest = id => {
  return {
    type: DELETE_STATISTIC_REQUEST,
    payload: {
      id
    }
  }
}

export const removeSuccess = data => {
  return {
    type: DELETE_STATISTIC_SUCCESS,
    payload: {
      data
    }
  }
}

export const removeFail = error => {
  return {
    type: DELETE_STATISTIC_FAIL,
    payload: {
      error
    }
  }
}
