import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import QuizDetails from '../../Componetns/QuizDetails/QuizDetails'
import BackgroundAudio from '../../../Games/Componetns/BackgroundAudio/BackgroundAudio'

import './QuestionContainer.scss'

import { nextGamePage, setQuizResults } from '../../Actions/GamesActions'

const DEELAY = 1300

class QuestionContainer extends Component {
  static propTypes = {}

  constructor(props) {
    super(props)

    this.onAnswer = this.onAnswer.bind(this)

    this.state = {
      answered: false,
      current: 0,
      questionsNumber: props.quiz.questions.length,
      correct: false
    }
  }

  onAnswer(answer) {
    const { isCorrect } = answer
    const { current, questionsNumber } = this.state
    if (current >= questionsNumber - 1) {
      this.setState({ complete: true, answered: true })

      setTimeout(() => {
        this.props.setQuizResults(isCorrect)
        this.props.nextGamePage(isCorrect)
        this.setState({ answered: false })
        this.setState({ answered: false })
      }, DEELAY)
    } else {
      this.setState({
        answered: true
      })
      setTimeout(() => {
        this.setState({
          current: this.state.current + 1,
          answered: false
        })
      }, DEELAY)
    }
  }

  render() {
    const { quiz, loading } = this.props
    const { answered, current, complete } = this.state

    return (
      <div className="container question-container">
        {loading ? (
          <div>loading...</div>
        ) : (
          <QuizDetails
            {...quiz}
            current={current}
            answered={answered}
            onAnswerClick={this.onAnswer}
          />
        )}
        {quiz.backgroundMusic && (
          <BackgroundAudio
            loop={quiz.backgroundMusic.repeat}
            music={quiz.backgroundMusic.src}
            isPlaying={true}
          />
        )}
      </div>
    )
  }
}

export default connect(
  state => ({
    quiz: state.games.getIn(['active', 'current', 'quiz']).toJS() || {},
    loading: state.games.getIn(['active', 'loading'])
  }),
  dispatch =>
    bindActionCreators(
      {
        nextGamePage,
        setQuizResults
      },
      dispatch
    )
)(QuestionContainer)
