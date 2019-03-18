import React, { Component, PropTypes } from 'react'

import ElementsPageContainer from '../../Containers/ElementsPageContainer/ElementsPageContainer'

class ElementsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <ElementsPageContainer>elements</ElementsPageContainer>
  }
}

export default ElementsRoute
