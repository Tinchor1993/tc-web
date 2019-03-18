import { fromJS, Map, List } from 'immutable'
import { many, single } from '../../../helpers/redux'

const defaultState = {
  active: single({
    loading: false,
    current: {}
  })
}

const initalState = fromJS(defaultState)

export default function SortingReducer(state = initalState, action) {
  switch (action.type) {
    default:
      return state
  }
}
