import React, { Component, PropTypes } from 'react'
import './SlideLayoutContainer.scss'

import { Text, Media, Both } from '../PresentationSlider'

class SlideLayoutContainer extends Component {
  constructor() {
    super()
  }

  getLayoutType() {
    return this.props.settings.layout
  }

  getTextDelay() {
    return this.props.settings.textDelay
  }

  getImageDelay() {
    return this.props.settings.imageDelay
  }

  getSlideComponent() {
    const layout = this.getLayoutType()

    if (layout === 'TEXT') {
      return Text
    }

    if (layout === 'MEDIA') {
      return Media
    }

    if (layout === 'ALL') {
      return Both
    }

    return <div>Not supported type</div>
  }

  render() {
    const slideComponent = this.getSlideComponent()

    return (
      <div className="presentation-slide-container">
        {slideComponent(this.props)}
      </div>
    )
  }
}

export default SlideLayoutContainer
