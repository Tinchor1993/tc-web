import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import classNames from 'classnames'

import { updatePageTitle } from '../../Actions/AppActions'

import Container from '../../Components/Container/Container'

import Debug from '../../../Framework/Debug'

export class AppContainer extends Component {
  static propTypes = {
    children: PropTypes.node,

    loggedIn: PropTypes.bool,
    user: PropTypes.object,

    getAppConfig: PropTypes.func
  }

  constructor() {
    super()
  }

  isHomePage() {
    return this.props.pathname === '/login'
  }

  render() {
    const { children, loggedIn, user } = this.props

    return (
      <div
        className={classNames('app-container', { login: this.isHomePage() })}
      >
        <Container>{children}</Container>
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    pathname: ownProps.location.pathname,
    pageTitle: state.app.get('pageTitle')
  }),
  dispatch =>
    bindActionCreators(
      {
        updatePageTitle
      },
      dispatch
    )
)(AppContainer)
