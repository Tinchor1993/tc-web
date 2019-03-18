import React, { Component, PropTypes } from 'react'

class StatisticDetailsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <div>statistic details</div>
  }
}

export default StatisticDetailsRoute
