import React, { Component, PropTypes } from 'react'

class StudentEditRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <div>student edit</div>
  }
}

export default StudentEditRoute
