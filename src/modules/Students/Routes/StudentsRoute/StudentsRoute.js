import React, { Component, PropTypes } from 'react'

import StudentsPage from '../../Containers/StudentsPage/StudentsPage'

class StudentsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return (
      <div>
        <StudentsPage />
      </div>
    )
  }
}

export default StudentsRoute
