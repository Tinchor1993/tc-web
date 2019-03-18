/**
 * Created by looch on 28/07/2017.
 */
import React, { Component } from 'react'
import GamesAccessContainer from '../../Containers/GamesAccessContainer/GamesAccessContainer'

class GamesAccessRoute extends Component {
  render() {
    const { children, location } = this.props

    return (
      <GamesAccessContainer location={location}>
        {children}
      </GamesAccessContainer>
    )
  }
}

export default GamesAccessRoute
