import many from '../../../helpers/actions/many'
import { push } from 'react-router-redux'
import { reset } from 'redux-form'

import Request from '../../Framework/API/Request'

const GAMES_ENDPOINT = `/api/v1/lessons`

export const GET_SINGLE_GAME_REQUEST = 'GET_SINGLE_GAME_REQUEST'
export const GET_SINGLE_GAME_SUCCESS = 'GET_SINGLE_GAME_SUCCESS'
export const GET_SINGLE_GAME_FAIL = 'GET_SINGLE_GAME_FAIL'

export const GET_ISPLAYED_GAME_REQUEST = 'GET_ISPLAYED_GAME_REQUEST'
export const GET_ISPLAYED_GAME_SUCCESS = 'GET_ISPLAYED_GAME_SUCCESS'
export const GET_ISPLAYED_GAME_FAIL = 'GET_ISPLAYED_GAME_FAIL'

export const FINISH_SINGLE_GAME_REQUEST = 'FINISH_SINGLE_GAME_REQUEST'
export const FINISH_SINGLE_GAME_SUCCESS = 'FINISH_SINGLE_GAME_SUCCESS'
export const FINISH_SINGLE_GAME_FAIL = 'FINISH_SINGLE_GAME_FAIL'

export const GET_ALL_GAMES_REQUEST = 'GET_ALL_GAMES_REQUEST'
export const GET_ALL_GAMES_SUCCESS = 'GET_ALL_GAMES_SUCCESS'
export const GET_ALL_GAMES_FAIL = 'GET_ALL_GAMES_FAIL'

export const INIT_PRESENTATION = 'INIT_PRESENTATION'
export const SET_PRESENTATION_SLIDE_INDEX = 'SET_PRESENTATION_SLIDE_INDEX'
export const REMOVE_ELEMENT = 'REMOVE_ELEMENT'

export const START_GAME = 'START_GAME'
export const GAME_STEP_INDEX = 'GAME_STEP_INDEX'

export const END_SORTING = 'END_SORTING'

export const SET_QUIZ_RESULTS = 'SET_QUIZ_RESULTS'
export const SET_SORTING_RESULTS = 'SET_SORTING_RESULTS'

export const AUTHORIZE = 'AUTHORIZE'
export const SIGNOUT = 'SIGNOUT'
export const TOGGLE_BACKGROUND_PLAYING = 'TOGGLE_BACKGROUND_PLAYING'

export const needReload = ({ id }, reloadId) => {
  return id !== reloadId
}

export const getSingle = id => {
  return dispatch => {
    dispatch(getSingleRequest())
    Request.get(`${GAMES_ENDPOINT}/${id}`)
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
    type: GET_SINGLE_GAME_REQUEST,
    payload: {
      id
    }
  }
}

export const getSingleSuccess = data => {
  return {
    type: GET_SINGLE_GAME_SUCCESS,
    payload: {
      data
    }
  }
}

export const getSingleFailed = error => {
  return {
    type: GET_SINGLE_GAME_FAIL,
    payload: {
      error
    }
  }
}

export const getIsPlayed = id => {
  return dispatch => {
    dispatch(getIsPlayedRequest())
    Request.get(`${GAMES_ENDPOINT}/${id}/isPlayed`)
      .then(res => res.data)
      .then(data => {
        dispatch(getIsPlayedSuccess(data))
      })
      .catch(err => {
        dispatch(getIsPlayedFailed(err))
      })
  }
}

export const getIsPlayedRequest = id => {
  return {
    type: GET_ISPLAYED_GAME_REQUEST,
    payload: {
      id
    }
  }
}

export const getIsPlayedSuccess = data => {
  return {
    type: GET_ISPLAYED_GAME_SUCCESS,
    payload: {
      data
    }
  }
}

export const getIsPlayedFailed = error => {
  return {
    type: GET_ISPLAYED_GAME_FAIL,
    payload: {
      error
    }
  }
}

export const getAll = () => {
  return dispatch => {
    dispatch(getAllRequest())
    Request.get(`${GAMES_ENDPOINT}/gameSelector`)
      .then(res => res.data)
      .then(data => {
        dispatch(getAllSuccess(data))
      })
      .catch(err => {
        dispatch(getAllFailed(err))
      })
  }
}

export const getAllRequest = () => {
  return {
    type: GET_ALL_GAMES_REQUEST
  }
}

export const getAllSuccess = data => {
  return {
    type: GET_ALL_GAMES_SUCCESS,
    payload: {
      data
    }
  }
}

export const getAllFailed = error => {
  return {
    type: GET_ALL_GAMES_FAIL,
    payload: {
      error
    }
  }
}

export const initPresentation = () => {
  return {
    type: INIT_PRESENTATION,
    payload: {}
  }
}

export const setSlide = index => {
  return {
    type: SET_PRESENTATION_SLIDE_INDEX,
    payload: {
      index
    }
  }
}

export const removeElement = id => {
  return {
    type: REMOVE_ELEMENT,
    payload: {
      id
    }
  }
}

export const startPresentation = gameId => {
  return push(`/games/${gameId}/presentation`)
}

export const startSorting = gameId => {
  return push(`/games/${gameId}/sorting`)
}

export const startQuiz = gameId => {
  return push(`/games/${gameId}/quiz/questions`)
}

export const startGameResulsts = gameId => {
  return push(`/games/${gameId}/quiz/results`)
}

export const startGame = id => {
  return dispatch => {
    dispatch(startGameAction(id))
    dispatch(nextGamePage(id))
  }
}

export const startGameAction = id => {
  return {
    type: START_GAME,
    payload: {
      id
    }
  }
}

const isGameFinished = (stepIndex, stepsCount) => {
  return stepIndex === stepsCount - 1
}

export const nextGamePage = () => {
  return (dispatch, getState) => {
    const stepIndex = getState().games.getIn(['game', 'stepIndex'])
    const ordering = getState()
      .games.getIn(['active', 'current', 'ordering'])
      .toJS()
    const gameId = getState().games.getIn(['active', 'current', 'id'])

    const finished = isGameFinished(stepIndex, ordering.length)
    if (finished) {
      const userId = getState().games.getIn(['user', 'id'])
      const results = getState()
        .games.getIn(['game', 'results'])
        .toJS()

      dispatch(finish(userId, gameId, results))
      dispatch(startGameResulsts(gameId))
    } else {
      setGameStepIndex(gameId, stepIndex + 1, ordering, dispatch)
    }
  }
}

export const setGameStepIndex = (id, index, steps, dispatch) => {
  const step = steps[index]

  dispatch({
    type: GAME_STEP_INDEX,
    payload: {
      index
    }
  })

  switch (step.title) {
    case 'Presentation':
      dispatch(startPresentation(id))
      return

    case 'Quiz Mode':
      dispatch(startQuiz(id))
      return

    case 'Sorting Mode':
      dispatch(startSorting(id))
      return
  }
}

export const setQuizResults = result => {
  return {
    type: SET_QUIZ_RESULTS,
    payload: {
      result
    }
  }
}

export const setSortingResults = result => {
  return {
    type: SET_SORTING_RESULTS,
    payload: {
      result
    }
  }
}

export const authorize = (gameId, data) => {
  return dispatch => {
    dispatch(athorizeUser(data))
    dispatch(push(`/games/list/`))
  }
}

export const athorizeUser = data => {
  return {
    type: AUTHORIZE,
    payload: {
      data
    }
  }
}

export const signOut = () => {
  return dispatch => {
    dispatch(signOutAction())
    dispatch(push(`/games/`))
  }
}

export const signOutAction = () => {
  return {
    type: SIGNOUT,
    payload: {
      data
    }
  }
}
export const toggleBackgroundPlaying = () => {
  return {
    type: TOGGLE_BACKGROUND_PLAYING
  }
}

export const finish = (userId, lessonId, data) => {
  return dispatch => {
    dispatch(finishRequest())

    Request.post(`${GAMES_ENDPOINT}/${lessonId}/results`, data)
      .then(res => res.data)
      .then(data => {
        dispatch(finishSuccess(data))
      })
      .catch(err => {
        dispatch(finishFailed(err))
      })
  }
}

export const finishRequest = (id, userId, results) => {
  return {
    type: FINISH_SINGLE_GAME_REQUEST,
    payload: {
      id,
      userId,
      results
    }
  }
}

export const finishSuccess = data => {
  return {
    type: FINISH_SINGLE_GAME_SUCCESS,
    payload: {
      data
    }
  }
}

export const finishFailed = error => {
  return {
    type: FINISH_SINGLE_GAME_FAIL,
    payload: {
      error
    }
  }
}
