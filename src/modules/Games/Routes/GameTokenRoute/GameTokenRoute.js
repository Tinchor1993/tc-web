import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import GameLoginContainer from '../../Containers/GameLoginContainer/GameLoginContainer'

class GameTokenRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props
    const { location } = this.props

    return (
      <GameLoginContainer location={location}>{children}</GameLoginContainer>
    )
  }
}

export default GameTokenRoute
