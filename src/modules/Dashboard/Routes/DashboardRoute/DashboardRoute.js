import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import LayoutContainer from '../../Containers/LayoutContainer/LayoutContainer'

class DashboardRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props
    const { location } = this.props

    return <LayoutContainer location={location}>{children}</LayoutContainer>
  }
}

export default DashboardRoute
