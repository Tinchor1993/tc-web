/**
 * Created by looch on 29/07/2017.
 */
import React, { Component, PropTypes } from 'react'
import LevelsPageContainer from '../../Containers/LevelsPageContainer/LevelsPageContainer'
class LevelsRoute extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  constructor() {
    super()
  }

  render() {
    const { children } = this.props

    return <LevelsPageContainer />
  }
}

export default LevelsRoute
