import React, { Component, PropTypes } from 'react'

import SubjectsPage from '../../Containers/SubjectsPage/SubjectsPage'

class SubjectsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <SubjectsPage />
  }
}

export default SubjectsRoute
