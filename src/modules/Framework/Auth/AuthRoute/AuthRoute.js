import React, { Component, PropTypes } from 'react'

class AuthRoute extends Component {
  static propTypes = {}

  constructor() {
    super()
  }

  componentWillMount() {
    if (!this.canAccess()) {
      this.props.router.push(this.failBackRoute())
    }

    this.onEnter()
  }

  onEnter() {
    console.log('onEnter')
  }

  getPermissions() {
    return {
      read: true,
      write: true,
      access: true
    }
  }

  canView() {
    return this.getPermissions().read
  }

  canEdit() {
    return this.getPermissions().write
  }

  canAccess() {
    return this.getPermissions().access
  }

  failBackRoute() {
    return '/no-access'
  }
}

export default AuthRoute
