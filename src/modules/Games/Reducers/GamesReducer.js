import { fromJS, Map, List } from 'immutable'
import { many, single } from '../../../helpers/redux'

import {
  GET_SINGLE_GAME_REQUEST,
  GET_SINGLE_GAME_SUCCESS,
  GET_SINGLE_GAME_FAIL,
  GET_ALL_GAMES_REQUEST,
  GET_ALL_GAMES_SUCCESS,
  GET_ALL_GAMES_FAIL,
  INIT_PRESENTATION,
  SET_PRESENTATION_SLIDE_INDEX,
  REMOVE_ELEMENT,
  START_GAME,
  GAME_STEP_INDEX,
  SET_QUIZ_RESULTS,
  SET_SORTING_RESULTS,
  TOGGLE_BACKGROUND_PLAYING,
  GET_ISPLAYED_GAME_SUCCESS,
  AUTHORIZE,
  SIGNOUT
} from '../Actions/GamesActions'

const defaultState = {
  active: single({
    loading: false,
    current: {
      titleEs: 'Loading...',
      descriptionEs: '',
      result: {},
      presentation: {
        slides: []
      },
      ordering: {},
      sorting: {},
      quiz: {}
    }
  }),
  presentation: {
    active: 0
  },
  game: {
    started: false,
    stepIndex: -1,
    isBackgroundPlaying: true,
    results: {
      sorting: null,
      quiz: null
    },
    isPlayed: false
  },
  games: {
    grid: many({
      list: []
    }),
    active: single({
      current: {
        title: 'Loading...'
      }
    })
  },
  hasAccess: false,
  user: {
    id: -1
  }
}

const initalState = fromJS(defaultState)

export default function GamesReducer(state = initalState, action) {
  switch (action.type) {
    case GET_ISPLAYED_GAME_SUCCESS:
      state = state.setIn(['game', 'isPlayed'], fromJS(action.payload.data))
      return state

    case GET_SINGLE_GAME_REQUEST:
      state = state.setIn(['active', 'loading'], true)
      return state

    case GET_SINGLE_GAME_SUCCESS:
      state = state.setIn(['active', 'current'], fromJS(action.payload.data))
      state = state.setIn(['active', 'loaded'], true)
      state = state.setIn(['active', 'loading'], false)
      state = state.setIn(['active', 'error'], null)
      return state

    case GET_SINGLE_GAME_FAIL:
      state = state.setIn(['active', 'error'], action.payload.error)
      return state

    case GET_ALL_GAMES_REQUEST:
      state = state.setIn(['games', 'grid', 'loading'], true)
      return state

    case GET_ALL_GAMES_SUCCESS:
      state = state.setIn(['games', 'grid', 'list'], List(action.payload.data))
      state = state.setIn(['games', 'grid', 'loaded'], true)
      state = state.setIn(['games', 'grid', 'loading'], false)
      state = state.setIn(['games', 'grid', 'error'], null)
      return state

    case GET_ALL_GAMES_FAIL:
      state = state.setIn(['games', 'grid', 'error'], action.payload.error)
      return state

    case INIT_PRESENTATION:
      state = state.setIn(['presentation', 'active'], 0)
      return state

    case SET_PRESENTATION_SLIDE_INDEX:
      state = state.setIn(['presentation', 'active'], action.payload.index)
      return state

    case REMOVE_ELEMENT:
      state = state.setIn(
        ['active', 'current', 'sorting', 'elements'],
        state
          .getIn(['active', 'current', 'sorting', 'elements'])
          .filter(function(x, index) {
            return index !== action.payload.id
          })
      )
      return state

    case START_GAME:
      state = state.setIn(['game', 'started'], true)
      state = state.setIn(['game', 'stepIndex'], -1)
      return state

    case GAME_STEP_INDEX:
      state = state.setIn(['game', 'stepIndex'], action.payload.index)
      return state

    case SET_QUIZ_RESULTS:
      state = state.setIn(['game', 'results', 'quiz'], action.payload.result)
      return state

    case TOGGLE_BACKGROUND_PLAYING:
      state = state.setIn(
        ['game', 'isBackgroundPlaying'],
        !state.getIn(['game', 'isBackgroundPlaying'])
      )
      return state

    case AUTHORIZE:
      state = state.setIn(['user'], fromJS(action.payload.data))
      state = state.setIn(['hasAccess'], true)
      return state

    case SIGNOUT:
      state = state.setIn(['hasAccess'], false)
      return state

    default:
      return state
  }
}
