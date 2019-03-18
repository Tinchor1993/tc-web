import React, { Component, PropTypes } from 'react'

import InviteStudentPage from '../../Containers/InviteStudentPage/InviteStudentPage'

class InviteStudentRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return (
      <div className="container">
        <InviteStudentPage />
      </div>
    )
  }
}

export default InviteStudentRoute
