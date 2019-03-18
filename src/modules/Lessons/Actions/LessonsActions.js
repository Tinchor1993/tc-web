import indexOf from 'lodash/indexOf'
import { push } from 'react-router-redux'
import { reset, initialize, destroy } from 'redux-form'
import { change, touch } from 'redux-form'

import Request from '../../Framework/API/Request'

const LESSONS_ENDPOINT = `/api/v1/lessons`

import { INFO, STEPS } from '../Constants/steps'

export const CREATE_LESSON_WIZARD_SET_STEP = 'CREATE_LESSON_WIZARD_SET_STEP'

export const GET_LESSONS_LIST_REQUEST = 'GET_LESSONS_LIST_REQUEST'
export const GET_LESSONS_LIST_SUCCESS = 'GET_LESSONS_LIST_SUCCESS'
export const GET_LESSONS_LIST_FAIL = 'GET_LESSONS_LIST_FAIL'

export const SET_LESSON_DATA = 'SET_LESSON_DATA'

export const CREATE_LESSON_REQUEST = 'CREATE_LESSON_REQUEST'
export const CREATE_LESSON_SUCCESS = 'CREATE_LESSON_SUCCESS'
export const CREATE_LESSON_FAIL = 'CREATE_LESSON_FAIL'

export const UPDATE_LESSON_REQUEST = 'UPDATE_LESSON_REQUEST'
export const UPDATE_LESSON_SUCCESS = 'UPDATE_LESSON_SUCCESS'
export const UPDATE_LESSON_FAIL = 'UPDATE_LESSON_FAIL'

export const GET_SINGLE_LESSON_REQUEST = 'GET_SINGLE_LESSON_REQUEST'
export const GET_SINGLE_LESSON_SUCCESS = 'GET_SINGLE_LESSON_SUCCESS'
export const GET_SINGLE_LESSON_FAIL = 'GET_SINGLE_LESSON_FAIL'

export const DELETE_LESSON_REQUEST = 'DELETE_SUBJECT_REQUEST'
export const DELETE_LESSON_SUCCESS = 'DELETE_SUBJECT_SUCCESS'
export const DELETE_LESSON_FAIL = 'DELETE_SUBJECT_FAIL'

export const INIT_EDIT_FORM = 'INIT_EDIT_FORM'
export const SET_ACTIVE_SLIDE = 'SET_ACTIVE_SLIDE'
export const APPLY_TO_SLIDE = 'APPLY_TO_SLIDE'
export const APPLY_TO_ALL_SLIDES = 'APPLY_TO_ALL_SLIDES'

export const setStep = step => {
  return {
    type: CREATE_LESSON_WIZARD_SET_STEP,
    payload: {
      step
    }
  }
}

export const getList = meta => {
  return dispatch => {
    dispatch(getListRequest())

    Request.get(LESSONS_ENDPOINT)
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
    type: GET_LESSONS_LIST_REQUEST,
    payload: {
      meta
    }
  }
}

export const getListSuccess = data => {
  return {
    type: GET_LESSONS_LIST_SUCCESS,
    payload: {
      data
    }
  }
}

export const getListFailed = error => {
  return {
    type: GET_LESSONS_LIST_SUCCESS,
    payload: {
      error
    }
  }
}

export const getSingle = id => {
  return dispatch => {
    dispatch(getSingleRequest())

    Request.get(`${LESSONS_ENDPOINT}/${id}`)
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
    type: GET_SINGLE_LESSON_REQUEST,
    payload: {
      id
    }
  }
}

export const getSingleSuccess = data => {
  return {
    type: GET_SINGLE_LESSON_SUCCESS,
    payload: {
      data
    }
  }
}

export const getSingleFailed = error => {
  return {
    type: GET_SINGLE_LESSON_FAIL,
    payload: {
      error
    }
  }
}

export const createLesson = lessonData => {
  return dispatch => {
    dispatch(createLessonRequest(lessonData))

    Request.post(LESSONS_ENDPOINT, lessonData)
      .then(res => res.data)
      .then(data => {
        dispatch(createLessonSuccess(data))
        dispatch(reset('wizard'))
        const redirectUrl = `/dashboard/lessons/`
        dispatch(push(redirectUrl))

        //
        //window.location.href = `/dashboard/lessons/`
      })
      .catch(err => {
        dispatch(createLessonFailed(err))
      })
  }
}

export const createLessonRequest = data => {
  return {
    type: CREATE_LESSON_REQUEST,
    payload: {
      data
    }
  }
}

export const createLessonSuccess = data => {
  return {
    type: CREATE_LESSON_SUCCESS,
    payload: {
      data
    }
  }
}

export const createLessonFailed = error => {
  return {
    type: CREATE_LESSON_FAIL,
    payload: {
      error
    }
  }
}

export const setLessonData = (part, data) => {
  return {
    type: SET_LESSON_DATA,
    payload: {
      part,
      data
    }
  }
}

export const updateLesson = (id, data) => {
  return dispatch => {
    dispatch(updateLessonRequest(id, data))
    Request.put(`${LESSONS_ENDPOINT}/${id}`, data)
      .then(res => res.data)
      .then(data => {
        dispatch(updateLessonSuccess(data))
        const redirectUrl = `/dashboard/lessons/${data.id}`
        dispatch(push(redirectUrl))
        dispatch(reset('wizard'))
        //window.location.href = redirectUrl
      })
      .catch(err => {
        dispatch(updateLessonFailed(err))
      })
  }
}

export const updateLessonRequest = (id, data) => {
  return {
    type: UPDATE_LESSON_REQUEST,
    payload: {
      id,
      data
    }
  }
}

export const updateLessonSuccess = data => {
  return {
    type: UPDATE_LESSON_SUCCESS,
    payload: {
      data
    }
  }
}

export const updateLessonFailed = error => {
  return {
    type: UPDATE_LESSON_FAIL,
    payload: {
      error
    }
  }
}

export const initLessonEditForm = values => {
  return dispatch => {
    dispatch(setStep(INFO))
    dispatch(setActiveSlide(0))
    dispatch(getSingleSuccess({}))
    dispatch(destroy('wizard'))
    dispatch(initialize('wizard', values))
  }
}

export const setActiveSlide = index => {
  return {
    type: SET_ACTIVE_SLIDE,
    payload: {
      index
    }
  }
}

export const applyToSlide = (index, settings) => {
  return {
    type: APPLY_TO_SLIDE,
    payload: {
      index,
      settings
    }
  }
}

const changeSlideSettings = (d, index, nextSettings) => {
  d(change(`wizard`, `presentation.slides[${index}].settings`, nextSettings))
  setTimeout(
    () =>
      d(
        touch(`wizard`, `presentation.slides[${index}].settings`, nextSettings)
      ),
    300
  )
}

export const applyToAllSlides = (settings, index, count) => {
  return dispatch => {
    for (let i = 0; i < count; i++) {
      changeSlideSettings(dispatch, i, settings[i])
    }

    dispatch({ type: APPLY_TO_SLIDE })

    // trigger slides rerender
    dispatch(setActiveSlide(0))
    setTimeout(() => dispatch(setActiveSlide(index)), 300)
  }
}

export const remove = (id, creationDate) => {
  return dispatch => {
    dispatch(removeRequest(id))

    Request.delete(`${LESSONS_ENDPOINT}/${id}?creationDate=${creationDate}`)
      .then(res => res.data)
      .then(data => {
        dispatch(removeSuccess(data))
        dispatch(push(`/dashboard/lessons`))
      })
      .catch(err => {
        dispatch(removeFail(err))
      })
  }
}

export const removeRequest = id => {
  return {
    type: DELETE_LESSON_REQUEST,
    payload: {
      id
    }
  }
}

export const removeSuccess = data => {
  return {
    type: DELETE_LESSON_SUCCESS,
    payload: {
      data
    }
  }
}

export const removeFail = error => {
  return {
    type: DELETE_LESSON_FAIL,
    payload: {
      error
    }
  }
}
