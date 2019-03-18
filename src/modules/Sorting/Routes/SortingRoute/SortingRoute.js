import React, { Component, PropTypes } from 'react'

import SortingLayoutContainer from '../../Containers/SortingLayoutContainer/SortingLayoutContainer'

class SortingRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { params } = this.props
    const { id } = params

    return <SortingLayoutContainer />
  }
}

export default SortingRoute
