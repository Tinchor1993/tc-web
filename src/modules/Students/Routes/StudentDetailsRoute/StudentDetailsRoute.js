import React, { Component, PropTypes } from 'react'

class StudentDetailsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <div>student invite</div>
  }
}

export default StudentDetailsRoute
