import React, { Component, PropTypes } from 'react'

import ElementDetailsPageContainer from '../../Containers/ElementDetailsPageContainer/ElementDetailsPageContainer'

class ElementDetailsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { params } = this.props
    const { id } = params

    return <ElementDetailsPageContainer id={id} />
  }
}

export default ElementDetailsRoute
