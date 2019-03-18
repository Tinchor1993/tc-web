import React, { Component, PropTypes } from 'react'
import QuestionContainer from '../../Containers/QuestionContainer/QuestionContainer'

import PresentationLayoutContainer from '../../Containers/PresentationLayoutContainer/PresentationLayoutContainer'

class PresentationRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { params, children } = this.props
    const { id } = params

    return (
      <PresentationLayoutContainer id={id}>
        {children}
      </PresentationLayoutContainer>
    )
  }
}

export default PresentationRoute
