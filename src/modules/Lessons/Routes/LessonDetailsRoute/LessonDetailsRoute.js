import React, { Component, PropTypes } from 'react'

import LessonDetailsPage from '../../Containers/LessonDetailsPage/LessonDetailsPage'

class LessonDetailsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children, params } = this.props
    const { id } = params

    return (
      <div className="container">
        <LessonDetailsPage id={id} />
      </div>
    )
  }
}

export default LessonDetailsRoute
