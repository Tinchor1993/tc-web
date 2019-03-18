import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import './GameLoginContainer.scss'
import '../../../../styles/components/buttons.scss'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class GameLoginContainer extends Component {
  constructor() {
    super()

    this.login = this.login.bind(this)
  }

  componentWillMount() {}

  login() {
    window.location = '/api/v1/auth'
  }

  getBackgroundClassNameList() {
    return `paper`
  }

  render() {
    const { error = '', quiz } = this.props
    const { name } = quiz

    return (
      <div className="page-background">
        <div className="game-login-container">
          <h1>{quiz.titleEn} Quiz</h1>

          <button
            className="web-app-btn web-app-btn-login"
            onClick={this.login}
          >
            Login
          </button>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    quiz: state.games.getIn(['active', 'current']).toJS(),
    loading: state.games.getIn(['active', 'loading'])
  }),
  dispatch => bindActionCreators({}, dispatch)
)(GameLoginContainer)
