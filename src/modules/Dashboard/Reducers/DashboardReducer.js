import { fromJS, Map, List } from 'immutable'

import { UPDATE_BREADCRUMBS } from '../././Actions/LayoutActions'

const defaultState = {
  breadcrumbs: [
    {
      path: '/dashboard',
      label: 'Dashboard'
    }
  ]
}

const initialState = fromJS(defaultState)

export default function DashboardReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BREADCRUMBS:
      state = state.setIn(['breadcrumbs'], List(action.payload.breadcrumbs))
      return state

    default:
      return state
  }
}
