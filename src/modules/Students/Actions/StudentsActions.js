import many from '../../../helpers/actions/many'
import { push } from 'react-router-redux'
import { reset } from 'redux-form'

import Request from '../../Framework/API/Request'

const STUDENTS_ENDPOINT = `/api/v1/students`

const EDIT_FORM_KEY = `editStudent`
const INVITE_FORM_KEY = `inviteStudent`

export const GET_STUDENTS_LIST_REQUEST = 'GET_STUDENTS_LIST_REQUEST'
export const GET_STUDENTS_LIST_SUCCESS = 'GET_STUDENTS_LIST_SUCCESS'
export const GET_STUDENTS_LIST_FAIL = 'GET_STUDENTS_LIST_FAIL'

export const GET_SINGLE_STUDENT_REQUEST = 'GET_SINGLE_STUDENT_REQUEST'
export const GET_SINGLE_STUDENT_SUCCESS = 'GET_SINGLE_STUDENT_SUCCESS'
export const GET_SINGLE_STUDENT_FAIL = 'GET_SINGLE_STUDENT_FAIL'

export const CREATE_STUDENT_REQUEST = 'CREATE_STUDENT_REQUEST'
export const CREATE_STUDENT_SUCCESS = 'CREATE_STUDENT_SUCCESS'
export const CREATE_STUDENT_FAIL = 'CREATE_STUDENT_FAIL'

export const UPDATE_STUDENT_REQUEST = 'UPDATE_STUDENT_REQUEST'
export const UPDATE_STUDENT_SUCCESS = 'UPDATE_STUDENT_SUCCESS'
export const UPDATE_STUDENT_FAIL = 'UPDATE_STUDENT_FAIL'

export const DELETE_STUDENT_REQUEST = 'DELETE_STUDENT_REQUEST'
export const DELETE_STUDENT_SUCCESS = 'DELETE_STUDENT_SUCCESS'
export const DELETE_STUDENT_FAIL = 'DELETE_STUDENT_FAIL'

export const INVITE_STUDENT_REQUEST = 'INVITE_STUDENT_REQUEST'
export const INVITE_STUDENT_SUCCESS = 'INVITE_STUDENT_SUCCESS'
export const INVITE_STUDENT_FAIL = 'INVITE_STUDENT_FAIL'

export const EXPORT_USER = 'EXPORT_USER'

export const getList = meta => {
  return dispatch => {
    dispatch(getListRequest())

    Request.get(`${STUDENTS_ENDPOINT}/all`)
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
    type: GET_STUDENTS_LIST_REQUEST,
    payload: {
      meta
    }
  }
}

export const getListSuccess = data => {
  return {
    type: GET_STUDENTS_LIST_SUCCESS,
    payload: {
      data
    }
  }
}

export const getListFailed = error => {
  return {
    type: GET_STUDENTS_LIST_FAIL,
    payload: {
      error
    }
  }
}

export const getSingle = id => {
  return dispatch => {
    dispatch(getSingleRequest())

    Request.get(`${STUDENTS_ENDPOINT}/${id}`)
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
    type: GET_SINGLE_STUDENT_REQUEST,
    payload: {
      id
    }
  }
}

export const getSingleSuccess = data => {
  return {
    type: GET_SINGLE_STUDENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const getSingleFailed = error => {
  return {
    type: GET_SINGLE_STUDENT_FAIL,
    payload: {
      error
    }
  }
}

export const create = subjectData => {
  return dispatch => {
    dispatch(createRequest(subjectData))

    Request.post(`${STUDENTS_ENDPOINT}/`, subjectData)
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
    type: CREATE_STUDENT_REQUEST,
    payload: {
      data
    }
  }
}

export const createSuccess = data => {
  return {
    type: CREATE_STUDENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const createFail = error => {
  return {
    type: CREATE_STUDENT_FAIL,
    payload: {
      error
    }
  }
}

export const update = (id, subjectData) => {
  return dispatch => {
    dispatch(updateRequest(id, subjectData))

    Request.put(`${STUDENTS_ENDPOINT}/${id}`, subjectData)
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
    type: UPDATE_STUDENT_REQUEST,
    payload: {
      id,
      data
    }
  }
}

export const updateSuccess = data => {
  return {
    type: UPDATE_STUDENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const updateFail = error => {
  return {
    type: UPDATE_STUDENT_FAIL,
    payload: {
      error
    }
  }
}

export const remove = id => {
  return dispatch => {
    dispatch(removeRequest(id))

    Request.delete(`${STUDENTS_ENDPOINT}/${id}`)
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
    type: DELETE_STUDENT_REQUEST,
    payload: {
      id
    }
  }
}

export const removeSuccess = data => {
  return {
    type: DELETE_STUDENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const removeFail = error => {
  return {
    type: DELETE_STUDENT_FAIL,
    payload: {
      error
    }
  }
}

export const invite = userData => {
  return dispatch => {
    dispatch(inviteRequest(userData))

    Request.post(`${STUDENTS_ENDPOINT}/invite`, userData)
      .then(res => res.data)
      .then(data => {
        dispatch(inviteSuccess(data))
        dispatch(push(`/dashboard/students`))
      })
      .catch(err => {
        dispatch(inviteFail(err))
      })
  }
}

export const inviteRequest = id => {
  return {
    type: INVITE_STUDENT_REQUEST,
    payload: {
      id
    }
  }
}

export const inviteSuccess = data => {
  return {
    type: INVITE_STUDENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const inviteFail = error => {
  return {
    type: INVITE_STUDENT_FAIL,
    payload: {
      error
    }
  }
}

export const exportTo = (type = 'pdf', userData) => {
  const data = {}

  Request.post(`${STUDENTS_ENDPOINT}/export?type=${type}`, data)
    .then(res => res.data)
    .then(data => {})
    .catch(err => {})

  return {
    type: EXPORT_USER,
    payload: {
      type,
      userData
    }
  }
}
