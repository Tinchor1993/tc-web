import React, { Component } from 'react'

import ContentContainer from '../../../App/Containers/ContentContainer/ContentContainer'
import './HomeRoute.scss'

import HomePageContainer from '../../Containers/HomePageContainer/HomePageContainer'

export class HomeRoute extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <ContentContainer customTitle="Home" id="home" fluid>
        <HomePageContainer />
      </ContentContainer>
    )
  }
}

export default HomeRoute
