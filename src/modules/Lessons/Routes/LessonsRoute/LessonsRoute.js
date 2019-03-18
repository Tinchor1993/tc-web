import React, { Component, PropTypes } from 'react'

import LessonsContainer from '../../Containers/LessonsPage/LessonsPage'

class LessonsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <LessonsContainer />
  }
}

export default LessonsRoute
