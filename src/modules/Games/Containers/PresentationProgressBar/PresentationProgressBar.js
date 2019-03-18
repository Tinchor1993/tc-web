import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './PresentationProgressBar.scss'

class PresentationProgressBar extends Component {
  constructor() {
    super()
  }

  getSlidesCount() {
    return this.props.slides.length - 1
  }

  getProgress() {
    const { current = 0 } = this.props
    const count = this.getSlidesCount()

    return current / count * 100 + 10
  }

  render() {
    const { current = 0 } = this.props

    const count = this.getSlidesCount()
    const progress = this.getProgress()

    return (
      <div className="presentation-progress-bar">
        <p className="stats">
          <span>{current + 1}</span> / <span>{count + 1}</span>
        </p>

        <div className="progress-line" style={{ width: `${progress}%` }} />
      </div>
    )
  }
}

export default connect(
  state => ({
    slides:
      state.games
        .getIn(['active', 'current', 'presentation', 'slides'])
        .toJS() || [],
    current: state.games.getIn(['presentation', 'active']) || 0
  }),
  dispatch => bindActionCreators({}, dispatch)
)(PresentationProgressBar)
