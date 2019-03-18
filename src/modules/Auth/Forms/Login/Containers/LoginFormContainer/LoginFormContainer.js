import React, { Component, PropTypes } from 'react'

import LoginForm from '../../Components/LoginForm/LoginForm'

class LoginFormContainer extends Component {
  constructor() {
    super()
  }

  onSubmit(data) {
    console.dir(data)
  }

  onReset() {}

  render() {
    return <LoginForm onSubmit={this.onSubmit} onReset={this.onReset} />
  }
}

export default LoginFormContainer
