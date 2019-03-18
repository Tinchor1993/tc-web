import React, { Component } from 'react'
import './QuestionTimer.scss'

class QuestionTimer extends Component {
  constructor(props) {
    super(props)
    this.state = { secondsElapsed: 60 }
  }

  tick() {
    const { secondsElapsed } = this.state

    if (secondsElapsed > 0) {
      this.setState({
        secondsElapsed: secondsElapsed - 1
      })
    } else {
      this.setState({
        secondsElapsed: 60
      })
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div className="timer-qestion">
        <div>{this.state.secondsElapsed}/60</div>
      </div>
    )
  }
}

export default QuestionTimer
