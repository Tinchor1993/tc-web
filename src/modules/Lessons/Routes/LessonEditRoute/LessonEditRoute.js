import React, { Component, PropTypes } from 'react'

import LessonEditPage from '../../Containers/LessonsEditPage/LessonsEditPage'

class LessonEditRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children, params } = this.props
    const { id } = params
    const { query } = this.props.location

    return (
      <div>
        <LessonEditPage query={query} id={id} />
      </div>
    )
  }
}

export default LessonEditRoute
