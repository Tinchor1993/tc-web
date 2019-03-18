import React, { Component, PropTypes } from 'react'

import LoginPageContainer from '../../Containers/DashboardLoginPageContainer/DashboardLoginPageContainer'

class LoginRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <LoginPageContainer>elements</LoginPageContainer>
  }
}

export default LoginRoute
