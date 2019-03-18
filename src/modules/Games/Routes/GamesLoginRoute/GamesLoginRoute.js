import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import GameLoginContainer from '../../Containers/GameLoginContainer/GameLoginContainer'

class GamesRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <GameLoginContainer>{children}</GameLoginContainer>
  }
}

export default GamesRoute
