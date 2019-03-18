import many from '../../../helpers/actions/many'
import { push } from 'react-router-redux'
import { reset } from 'redux-form'

import Request from '../../Framework/API/Request'

const ELEMENTS_ENDPOINT = `/api/v1/elements`
const ELEMENTS_FOLDER_ENDPOINT = `/api/v1/elements/folders`

const EDIT_FORM_KEY = `editElement`

export const GET_ELEMENTS_LIST_REQUEST = 'GET_ELEMENTS_LIST_REQUEST'
export const GET_ELEMENTS_LIST_SUCCESS = 'GET_ELEMENTS_LIST_SUCCESS'
export const GET_ELEMENTS_LIST_FAIL = 'GET_ELEMENTS_LIST_FAIL'

export const GET_SINGLE_ELEMENT_REQUEST = 'GET_SINGLE_ELEMENT_REQUEST'
export const GET_SINGLE_ELEMENT_SUCCESS = 'GET_SINGLE_ELEMENT_SUCCESS'
export const GET_SINGLE_ELEMENT_FAIL = 'GET_SINGLE_ELEMENT_FAIL'

export const CREATE_ELEMENT_REQUEST = 'CREATE_ELEMENT_REQUEST'
export const CREATE_ELEMENT_SUCCESS = 'CREATE_ELEMENT_SUCCESS'
export const CREATE_ELEMENT_FAIL = 'CREATE_ELEMENT_FAIL'

export const UPDATE_ELEMENT_REQUEST = 'UPDATE_ELEMENT_REQUEST'
export const UPDATE_ELEMENT_SUCCESS = 'UPDATE_ELEMENT_SUCCESS'
export const UPDATE_ELEMENT_FAIL = 'UPDATE_ELEMENT_FAIL'

export const DELETE_ELEMENT_REQUEST = 'DELETE_ELEMENT_REQUEST'
export const DELETE_ELEMENT_SUCCESS = 'DELETE_ELEMENT_SUCCESS'
export const DELETE_ELEMENT_FAIL = 'DELETE_ELEMENT_FAIL'

export const DELETE_FOLDER_REQUEST = 'DELETE_FOLDER_REQUEST'
export const DELETE_FOLDER_SUCCESS = 'DELETE_FOLDER_SUCCESS'
export const DELETE_FOLDER_FAIL = 'DELETE_FOLDER_FAIL'

export const GET_FOLDERS_REQUEST = 'GET_FOLDERS_REQUEST'
export const GET_FOLDERS_SUCCESS = 'GET_FOLDERS_SUCCESS'
export const GET_FOLDERS_FAIL = 'GET_FOLDERS_FAIL'
export const CHANGE_FOLDER = 'CHANGE_FOLDER'
import FOLDER_ALL from '../../Elements/Constants/folders'
export const getList = meta => {
  return dispatch => {
    dispatch(getListRequest())
    const listUrl =
      meta.folder === FOLDER_ALL
        ? `${ELEMENTS_ENDPOINT}`
        : `${ELEMENTS_ENDPOINT}/folders/${meta.folder}`

    Request.get(listUrl)
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
    type: GET_ELEMENTS_LIST_REQUEST,
    payload: {
      meta
    }
  }
}

export const getListSuccess = data => {
  return {
    type: GET_ELEMENTS_LIST_SUCCESS,
    payload: {
      data
    }
  }
}

export const getListFailed = error => {
  return {
    type: GET_ELEMENTS_LIST_FAIL,
    payload: {
      error
    }
  }
}
export const getFolders = () => {
  return dispatch => {
    dispatch(getFoldersRequest())

    Request.get(`${ELEMENTS_ENDPOINT}/folders`)
      .then(res => res.data)
      .then(data => {
        dispatch(getFoldersSuccess(data))
      })
      .catch(err => {
        dispatch(getFoldersFailed(err))
      })
  }
}

export const getFoldersRequest = meta => {
  return {
    type: GET_FOLDERS_REQUEST,
    payload: {
      meta
    }
  }
}

export const getFoldersSuccess = data => {
  return {
    type: GET_FOLDERS_SUCCESS,
    payload: {
      data
    }
  }
}

export const getFoldersFailed = error => {
  return {
    type: GET_FOLDERS_FAIL,
    payload: {
      error
    }
  }
}
export const changeFolder = activeFolder => {
  return {
    type: CHANGE_FOLDER,
    payload: {
      activeFolder
    }
  }
}
export const removeFolder = id => {
  return dispatch => {
    dispatch(removeFolderRequest(id))
    Request.delete(`${ELEMENTS_FOLDER_ENDPOINT}/delete/${id}`)
      .then(res => res.data)
      .then(data => {
        dispatch(removeFolderSuccess(data))
      })
      .catch(err => {
        dispatch(removeFolderFail(err))
      })
  }
}
export const removeFolderRequest = id => {
  return {
    type: DELETE_FOLDER_REQUEST,
    payload: {
      id
    }
  }
}

export const removeFolderSuccess = data => {
  return {
    type: DELETE_FOLDER_SUCCESS,
    payload: {
      data
    }
  }
}

export const removeFolderFail = error => {
  return {
    type: DELETE_FOLDER_FAIL,
    payload: {
      error
    }
  }
}

export const getSingle = id => {
  return dispatch => {
    dispatch(getSingleRequest())

    Request.get(`${ELEMENTS_ENDPOINT}/${id}`)
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
    type: GET_SINGLE_ELEMENT_REQUEST,
    payload: {
      id
    }
  }
}

export const getSingleSuccess = data => {
  return {
    type: GET_SINGLE_ELEMENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const getSingleFailed = error => {
  return {
    type: GET_SINGLE_ELEMENT_FAIL,
    payload: {
      error
    }
  }
}

export const create = elementData => {
  return dispatch => {
    dispatch(createRequest(elementData))

    Request.post(`${ELEMENTS_ENDPOINT}/`, elementData)
      .then(res => res.data)
      .then(data => {
        dispatch(createSuccess(data))
        dispatch(reset(EDIT_FORM_KEY))
        dispatch(push(`/dashboard/elements/`))
      })
      .catch(err => {
        dispatch(createFail(err))
      })
  }
}

export const createRequest = data => {
  return {
    type: CREATE_ELEMENT_REQUEST,
    payload: {
      data
    }
  }
}

export const createSuccess = data => {
  return {
    type: CREATE_ELEMENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const createFail = error => {
  return {
    type: CREATE_ELEMENT_FAIL,
    payload: {
      error
    }
  }
}

export const update = (id, elementData) => {
  return dispatch => {
    dispatch(updateRequest(id, elementData))

    Request.put(`${ELEMENTS_ENDPOINT}/${id}`, elementData)
      .then(res => res.data)
      .then(data => {
        dispatch(updateSuccess(data))
        dispatch(reset(EDIT_FORM_KEY))
        dispatch(push(`/dashboard/elements/`))
      })
      .catch(err => {
        dispatch(updateFail(err))
      })
  }
}

export const updateRequest = (id, data) => {
  return {
    type: UPDATE_ELEMENT_REQUEST,
    payload: {
      id,
      data
    }
  }
}

export const updateSuccess = data => {
  return {
    type: UPDATE_ELEMENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const updateFail = error => {
  return {
    type: UPDATE_ELEMENT_FAIL,
    payload: {
      error
    }
  }
}

export const remove = (id, creationDate) => {
  return dispatch => {
    dispatch(removeRequest(id))

    Request.delete(`${ELEMENTS_ENDPOINT}/${id}?creationDate=${creationDate}`)
      .then(res => res.data)
      .then(data => {
        dispatch(removeSuccess(data))
        dispatch(push(`/dashboard/elements`))
      })
      .catch(err => {
        dispatch(removeFail(err))
      })
  }
}

export const removeRequest = id => {
  return {
    type: DELETE_ELEMENT_REQUEST,
    payload: {
      id
    }
  }
}

export const removeSuccess = data => {
  return {
    type: DELETE_ELEMENT_SUCCESS,
    payload: {
      data
    }
  }
}

export const removeFail = error => {
  return {
    type: DELETE_ELEMENT_FAIL,
    payload: {
      error
    }
  }
}
