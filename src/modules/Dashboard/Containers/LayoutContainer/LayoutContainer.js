import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { updateBreadcrumbs } from '../../Actions/LayoutActions'

import { logout } from '../../../Auth/Actions/AuthActions'

import NavBar from '../../Components/NavBar/NavBar'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs'
import Content from '../../Components/Content/Content'

class LayoutContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()

    this.onLogout = this.onLogout.bind(this)
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs()
    this.props.updateBreadcrumbs(breadcrumbs)

    if (!this.props.isAuthorized) {
      this.props.push('/dashboard/login')
    }
  }

  getBreadcrumbs() {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      }
    ]
  }

  onLogout() {
    this.props.logout()
  }

  render() {
    const { children, breadcrumbs, location } = this.props
    const needShowBreadcrumbs = breadcrumbs.length > 1

    return (
      <div>
        <NavBar onLogout={this.onLogout} pn={location.pathname} />

        {needShowBreadcrumbs ? <Breadcrumbs breadcrumbs={breadcrumbs} /> : null}

        <Content>{children}</Content>
      </div>
    )
  }
}

export default connect(
  state => ({
    isAuthorized: state.auth.getIn(['loggedIn']),
    breadcrumbs: state.dashboard.get('breadcrumbs').toJS()
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        push,
        logout
      },
      dispatch
    )
)(LayoutContainer)
