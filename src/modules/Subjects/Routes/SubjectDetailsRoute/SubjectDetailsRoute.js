import React, { Component, PropTypes } from 'react'

import SubjectDetailsPage from '../../Containers/SubjectDetailsPage/SubjectDetailsPage'

class SubjectDetailsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { params } = this.props
    const { id } = params

    return <SubjectDetailsPage id={id} />
  }
}

export default SubjectDetailsRoute
