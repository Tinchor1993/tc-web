import React, { Component, PropTypes } from 'react'
import QuestionContainer from '../../Containers/QuestionContainer/QuestionContainer'

class QuestionRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { params } = this.props
    const { id } = params

    return <QuestionContainer id={id} />
  }
}

export default QuestionRoute
