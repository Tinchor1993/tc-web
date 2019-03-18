import React, { Component } from 'react'
import classNames from 'classnames'
import './ResultRating.scss'

class ResultRating extends Component {
  constructor() {
    super()
    this.state = { ready: false }
  }

  componentDidMount() {
    this.setState({
      ready: true
    })
  }

  render() {
    return (
      <div
        className={classNames('result-rating pulse', {
          animated: this.state.ready
        })}
      >
        <p>A+</p>
      </div>
    )
  }
}

export default ResultRating
