import React from 'react'
import { Route, IndexRoute } from 'react-router'

import { default as AppContainer } from './modules/App'

import { HomeRoute } from './modules/Home/Routes/HomeRoute/HomeRoute'

import { NoAccessRoute } from './modules/NoAccess/Routes/NoAccessRoute/NoAccessRoute'
import { NotFoundRoute } from './modules/NotFound/Routes/NotFoundRoute/NotFoundRoute'

import DashboardRoute from './modules/Dashboard/Routes/DashboardRoute/DashboardRoute'
import DashboardLoginPageContainer from './modules/Auth/Containers/DashboardLoginPageContainer/DashboardLoginPageContainer'

/**
 * Subjects
 */
import SubjectsRoute from './modules/Subjects/Routes/SubjectsRoute/SubjectsRoute'
import SubjectEditRoute from './modules/Subjects/Routes/SubjectEditRoute/SubjectEditRoute'
import SubjectDetailsRoute from './modules/Subjects/Routes/SubjectDetailsRoute/SubjectDetailsRoute'

/**
 * api
 */
import LessonsRoute from './modules/Lessons/Routes/LessonsRoute/LessonsRoute'
import LessonEditRoute from './modules/Lessons/Routes/LessonEditRoute/LessonEditRoute'
import LessonDetailsRoute from './modules/Lessons/Routes/LessonDetailsRoute/LessonDetailsRoute'

/**
 * Levels
 */

import LevelsRoute from './modules/Levels/Routes/LevelsRoute/LevelsRoute'

/**
 * Elements
 **/
import ElementsRoute from './modules/Elements/Routes/ElementsRoute/ElementsRoute'
import ElementDetailsRoute from './modules/Elements/Routes/ElementDetailsRoute/ElementDetailsRoute'
import ElementEditRoute from './modules/Elements/Routes/ElementEditRoute/ElementEditRoute'

/**
 * Students
 **/
import StudentsRoute from './modules/Students/Routes/StudentsRoute/StudentsRoute'
import StudentDetailsRoute from './modules/Students/Routes/StudentDetailsRoute/StudentDetailsRoute'
import StudentEditRoute from './modules/Students/Routes/StudentEditRoute/StudentEditRoute'
import InviteStudentRoute from './modules/Students/Routes/InviteStudentRoute/InviteStudentRoute'

/**
 * Statistic
 **/
import StatisticRoute from './modules/Statistic/Routes/StatisticRoute/StatisticRoute'
import StatisticDetailsRoute from './modules/Statistic/Routes/StatisticDetailsRoute/StatisticDetailsRoute'

/**
 * Games
 **/
import GamesAccessRoute from './modules/Games/Routes/GamesAccessRoute/GamesAccessRoute'
import GamesRoute from './modules/Games/Routes/GamesRoute/GamesRoute'
import GamesListRoute from './modules/Games/Routes/GamesListRoute/GamesListRoute'
import GamesLoginRoute from './modules/Games/Routes/GamesLoginRoute/GamesLoginRoute'
import GameTokenRoute from './modules/Games/Routes/GameTokenRoute/GameTokenRoute'
import QuizRoute from './modules/Games/Routes/QuizRoute/QuizRoute'
import QuestionRoute from './modules/Games/Routes/QuestionRoute/QuestionRoute'
import ResultRoute from './modules/Games/Routes/ResultRoute/ResultRoute'

import PresentationRoute from './modules/Games/Routes/PresentationRoute/PresentationRoute'

import SortingRoute from './modules/Sorting/Routes/SortingRoute/SortingRoute'

export const routes = (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={HomeRoute} />

    {/* Home */}
    <Route path="/home" component={HomeRoute} />

    <Route path="/dashboard/login" component={DashboardLoginPageContainer} />

    {/* Dashboard */}
    <Route path="/dashboard" component={DashboardRoute}>
      <IndexRoute component={SubjectsRoute} />

      {/* api */}
      <Route path="/dashboard/lessons" component={LessonsRoute} />
      <Route path="/dashboard/lessons/new/edit" component={LessonEditRoute} />
      <Route path="/dashboard/lessons/:id/edit" component={LessonEditRoute} />
      <Route path="/dashboard/lessons/:id" component={LessonDetailsRoute} />

      {/* Levels */}
      <Route path="/dashboard/levels" component={LevelsRoute} />

      {/* Elements */}
      <Route path="/dashboard/elements" component={ElementsRoute} />
      <Route path="/dashboard/elements/new/edit" component={ElementEditRoute} />
      <Route path="/dashboard/elements/:id/edit" component={ElementEditRoute} />
      <Route path="/dashboard/elements/:id" component={ElementDetailsRoute} />

      {/* Subjects */}
      <Route path="/dashboard/subjects" component={SubjectsRoute} />
      <Route path="/dashboard/subjects/new/edit" component={SubjectEditRoute} />
      <Route path="/dashboard/subjects/:id/edit" component={SubjectEditRoute} />
      <Route path="/dashboard/subjects/:id" component={SubjectDetailsRoute} />

      {/* Students */}
      <Route path="/dashboard/students" component={StudentsRoute} />
      <Route path="/dashboard/students/invite" component={InviteStudentRoute} />
      <Route path="/dashboard/students/:id/edit" component={StudentEditRoute} />
      <Route path="/dashboard/students/:id" component={StudentDetailsRoute} />

      {/* Statistic */}
      <Route path="/dashboard/statistic" component={StatisticRoute} />
      <Route
        path="/dashboard/statistic/:id"
        component={StatisticDetailsRoute}
      />
    </Route>

    {/* Games */}
    <Route path="/games" components={GamesAccessRoute}>
      <Route path="/games/list" component={GamesListRoute} />
      <Route path="/games/no-access" component={GamesLoginRoute} />
      <Route path="/games/token" component={GameTokenRoute} />

      <Route path="/games/:id" component={GamesRoute}>
        <Route path="/games/:id/quiz" component={QuizRoute}>
          <Route path="/games/:id/quiz/questions" component={QuestionRoute} />
          <Route path="/games/:id/quiz/results" component={ResultRoute} />
        </Route>

        <Route path="/games/:id/sorting" component={SortingRoute} />
        <Route path="/games/:id/presentation" component={PresentationRoute} />
      </Route>
    </Route>

    {/* No Access */}
    <Route path="/no-access" component={NoAccessRoute} />

    {/* Not Found */}
    <Route path="*" component={NotFoundRoute} />
  </Route>
)

export default routes
