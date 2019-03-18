import React, { Component, PropTypes } from 'react'

import StatisticPage from '../../Containers/StatisticPage/StatisticPage'

class StatisticRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <StatisticPage />
  }
}

export default StatisticRoute
