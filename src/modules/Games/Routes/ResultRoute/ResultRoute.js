import React, { Component, PropTypes } from 'react'
import Result from '../../Componetns/Result/Result'

class ResultRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <Result />
  }
}

export default ResultRoute
