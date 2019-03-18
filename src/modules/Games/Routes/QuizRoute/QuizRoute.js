import React, { Component, PropTypes } from 'react'
import QuizContainer from '../../Containers/QuizContainer/QuizContainer'

class GamesRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <QuizContainer>{children}</QuizContainer>
  }
}

export default GamesRoute
