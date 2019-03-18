import React, { Component, PropTypes } from 'react'

import GameLayoutContainer from '../../Containers/GameLayoutContainer/GameLayoutContainer'

class GamesRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props
    const { params, location } = this.props
    const { id } = params

    return (
      <GameLayoutContainer id={id} location={location}>
        {children}
      </GameLayoutContainer>
    )
  }
}

export default GamesRoute
