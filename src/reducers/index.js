import { combineReducers } from 'redux'

import { routerReducer as routing } from 'react-router-redux'
import { reducer as form } from 'redux-form'

import { gridReducer as grid } from '../modules/Framework/Grid'

import AppReducer from '../modules/App/Reducers/AppReducer'

import DashboardReducer from '../modules/Dashboard/Reducers/DashboardReducer'
import SubjectsReducer from '../modules/Subjects/Reducers/SubjectsReducer'
import LessonsReducer from '../modules/Lessons/Reducers/LessonsReducer'
import LevelsReducer from '../modules/Levels/Reducers/LevelsReducer'
import ElementsReducer from '../modules/Elements/Reducers/ElementsReducer'
import StudentsReducer from '../modules/Students/Reducers/StudentsReducer'
import StatisticReducer from '../modules/Statistic/Reducers/StatisticReducer'
import AuthReducer from '../modules/Auth/Reducers/AuthReducer'
import GamesReducer from '../modules/Games/Reducers/GamesReducer'
import SortingReducer from '../modules/Sorting/Reducers/SortingReducer'

const rootReducer = combineReducers({
  routing,
  form,
  grid,

  app: AppReducer,
  auth: AuthReducer,
  dashboard: DashboardReducer,

  subjects: SubjectsReducer,
  lessons: LessonsReducer,
  elements: ElementsReducer,
  students: StudentsReducer,
  statistic: StatisticReducer,
  games: GamesReducer,
  sorting: SortingReducer,
  levels: LevelsReducer
})

export default rootReducer
