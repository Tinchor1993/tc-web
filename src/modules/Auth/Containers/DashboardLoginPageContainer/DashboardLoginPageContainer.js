import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './DashboardLoginPageContainer.scss'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import { login } from '../../Actions/AuthActions'

import LoginForm from '../../Forms/LoginForm'

class DashboardLoginPageContainer extends Component {
  constructor() {
    super()

    this.login = this.login.bind(this)
  }

  componentWillMount() {}

  login(data) {
    this.props.login(data)
  }

  render() {
    const { error = '' } = this.props

    return (
      <div className="hover">
        <div className="login-container">
          <div className="col-md-6 form-promo">
            <h1 className="text-center heading">
              <p>Thinking Cap App</p>
              <p>CMS</p>
            </h1>
          </div>

          <div className="col-md-6 form-login">
            <LoginForm onSubmit={this.login} customError={error} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    error: state.auth.getIn(['error'])
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        login
      },
      dispatch
    )
)(DashboardLoginPageContainer)
