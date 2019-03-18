import React, { Component } from 'react'

import ContentContainer from '../../../App/Containers/ContentContainer/ContentContainer'
import './NoAccessContainer.scss'

export class NoAccessRoute extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <ContentContainer customTitle="No access!" id="noAccess" fluid>
        No Access
      </ContentContainer>
    )
  }
}

export default NoAccessRoute
