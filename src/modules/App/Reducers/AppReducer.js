import Immutable, { fromJS, List, Map } from 'immutable'

import { UPDATE_PAGE_TITLE } from '../Actions/AppActions'

const defaultState = {
  pageTitle: 'Dashboard'
}

const setPageTitle = title => (document.title = title)

const initialState = fromJS(defaultState)

export default function AppReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PAGE_TITLE:
      state = state.set('pageTitle', action.payload.title)
      setPageTitle(action.payload.title)
      return state

    default:
      return state
  }
}
