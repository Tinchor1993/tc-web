import axios from 'axios'

const ACTIONS_PREFIX = '@@THCAPP/LIST'

const REQUEST_POSTFIX = 'REQUEST'
const SUCCESS_POSTFIX = 'SUCCESS'
const FAIL_POSTFIX = 'FAIL'

const getListActions = resource => {
  return {
    GET_ALL_REQUEST: `${ACTIONS_PREFIX}/${resource}/${REQUEST_POSTFIX}`,
    GET_ALL_SUCCESS: `${ACTIONS_PREFIX}/${resource}/${REQUEST_POSTFIX}`,
    GET_ALL_FAIL: `${ACTIONS_PREFIX}/${resource}/${REQUEST_POSTFIX}`
  }
}

const getAll = (
  { GET_ALL_REQUEST, GET_ALL_SUCCESS, GET_ALL_FAIL },
  endpoint
) => {
  return dispatch => {
    dispatch(getAllRequest(GET_ALL_REQUEST))

    axios
      .get(endpoint)
      .then(data => dispatch(getAllSuccess(GET_ALL_SUCCESS, data)))
      .catch(err => dispatch(getAllFail(GET_ALL_FAIL, err)))
  }
}

const getAllRequest = type => {
  return {
    type
  }
}

const getAllSuccess = (type, data) => {
  return {
    type,
    payload: {
      data
    }
  }
}

const getAllFail = (type, err) => {
  return {
    type,
    payload: {
      error
    }
  }
}

const getListCreations = (actions, endpoint) => {
  return {
    getAll: () => {
      return getAll.apply(actions, endpoint)
    }
  }
}

export default (resource, { endpoint }) => {
  resource = resource.toUpperCase()

  const actions = getListActions(resource)
  const creators = getListCreations(actions, endpoint)

  const listActionCreators = {
    ...actions,
    ...creators
  }

  return listActionCreators
}
