import React, { Component, PropTypes } from 'react'

import SubjectsEditPage from '../../Containers/SubjectsEditPage/SubjectsEditPage'

class SubjectEditRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { params } = this.props
    const { id } = params

    return <SubjectsEditPage id={id} />
  }
}

export default SubjectEditRoute
