/* eslint-disable import/default */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { routes } from './routes'
import configureStore from './store/configureStore'
require('./favicon.ico')
import 'react-table/react-table.css'
import 'react-select/dist/react-select.css'
import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss'
import 'animate.css/animate.min.css'
import './styles/main.scss'
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('app')
)
