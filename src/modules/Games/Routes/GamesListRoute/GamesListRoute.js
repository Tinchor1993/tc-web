import React, { Component, PropTypes } from 'react'

import GameListContainer from '../../Containers/GameListContainer/GameListContainer'

class GamesListRoute extends Component {
  render() {
    const { params } = this.props
    const { id } = params

    return <GameListContainer id={id} />
  }
}

export default GamesListRoute
