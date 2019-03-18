import React, { Component, PropTypes } from 'react'
import './Result.scss'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ResultRating from '../ResultRating/ResultRating'

const ResultDontPassed = ({ score, lessonTitle }) => (
  <div>
    <h3>{lessonTitle}</h3>
  </div>
)

const ResultPassed = ({ score, lessonTitle }) => (
  <div>
    <h3>{lessonTitle}</h3>
    <ResultRating />
  </div>
)

class Result extends Component {
  constructor() {
    super()
  }

  componentWillMount() {
    const { userId, gameId } = this.props
    if (!userId) return
    if (!gameId) return
  }

  getScore() {
    const { results: { sorting, quiz } } = this.props
    let score = 0
    if (sorting) score++
    if (quiz) score++

    return score
  }

  isScoreGood(score) {
    return score > 1
  }

  render() {
    const { isStarted, title } = this.props
    const score = this.getScore()

    return (
      isStarted && (
        <div className="result-page">
          {this.isScoreGood(score) ? (
            <ResultPassed lessonTitle={title} />
          ) : (
            <ResultDontPassed lessonTitle={title} />
          )}
          <Link className="btn-thc medium" to="/games/list">
            Back to games list
          </Link>
        </div>
      )
    )
  }
}

export default connect(
  state => ({
    title: state.games.getIn(['active', 'current', 'titleEn']),
    isStarted: state.games.getIn(['game', 'started']),
    results: state.games.getIn(['game', 'results']).toJS(),
    result: state.games.getIn(['active', 'current', 'result']).toJS()
  }),
  dispatch => bindActionCreators({}, dispatch)
)(Result)
