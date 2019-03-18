import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import QuizToolBar from '../../Componetns/QuizToolBar/QuizToolBar'
import Question from '../QuestionContainer/QuestionContainer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { signOut } from '../../Actions/GamesActions'

class QuizContainer extends Component {
  constructor() {
    super()

    this.logout = this.logout.bind(this)
  }

  componentWillMount() {}

  logout() {
    this.props.signOut()
  }

  getBackgroundClassNameList() {
    return `paper`
  }

  render() {
    const { children, error = '', quiz } = this.props
    const { name } = quiz

    return (
      <div className="">
        <QuizToolBar logout={this.logout} />

        {children}
      </div>
    )
  }
}

export default connect(
  state => ({
    quiz: state.games.getIn(['active', 'current']).toJS(),
    loading: state.games.getIn(['active', 'loding'])
  }),
  dispatch => bindActionCreators({}, dispatch)
)(QuizContainer)
