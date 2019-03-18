import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'

import BackgroundAudio from '../../../Games/Componetns/BackgroundAudio/BackgroundAudio'
import './SortingLayoutContainer.scss'

import SortingArea from '../../Areas/DnDTest'

import {
  removeElement,
  setSortingResults,
  nextGamePage,
  toggleBackgroundPlaying
} from '../../../Games/Actions/GamesActions'

const DELAY = 3000

const Background = ({ background, children }) =>
  background ? (
    <div
      className="sorting-container"
      style={{ background: `url("${background}")` }}
    >
      {children}
    </div>
  ) : (
    <div />
  )

class SortingLayoutContainer extends Component {
  constructor() {
    super()

    this.onSuccess = this.onSuccess.bind(this)
    this.onError = this.onError.bind(this)
    this.moveToTrash = this.moveToTrash.bind(this)
    this.audioFile = new Audio()
    this.state = {
      showResults: false,
      correct: true,
      indexToShow: -1,
      background: 'paper'
    }
  }

  componentWillReceiveProps(next) {
    const { id } = next
  }

  getBackgroundClassNameList() {
    return this.state.background
  }

  setBackgroundClassNameList(background) {
    this.setState({ background })
  }

  showResults() {
    this.setState({ showResults: true })
    this.props.toggleBackgroundPlaying()
    this.timer = setTimeout(() => {
      this.props.toggleBackgroundPlaying()
      this.setState({ showResults: false })
      this.audioFile.pause()
    }, DELAY)
  }

  onSuccess(el, index) {
    const { game } = this.props
    const { sorting } = game
    const { successes } = sorting

    const indexToShow =
      successes && successes.length > 0
        ? Math.floor(Math.random() * successes.length)
        : -1

    this.setState({
      correct: true,
      indexToShow: indexToShow
    })
    if (successes && indexToShow > -1) {
      if (sorting.successes[indexToShow].audio) {
        this.audioFile.src = successes[indexToShow].audio.src
        this.audioFile.play()
      }
    }

    this.showResults()

    this.removeElement(index)
  }

  onError() {
    const { game } = this.props
    const { sorting } = game
    const { fails } = sorting

    const indexToShow =
      fails && fails.length > 0 ? Math.floor(Math.random() * fails.length) : -1

    this.setState({
      correct: false,
      indexToShow: indexToShow
    })

    if (fails && indexToShow > -1) {
      if (sorting.fails[indexToShow].audio) {
        this.audioFile.src = sorting.fails[indexToShow].audio.src
        this.audioFile.play()
      }
    }

    this.showResults()
  }

  moveToTrash(index) {
    this.removeElement(index)
  }

  removeElement(id) {
    if (this.props.game.sorting.elements.length === 1) {
      this.props.setSortingResults(true)
      this.played()
    }
    this.props.removeElement(id)
  }

  played() {
    setTimeout(() => {
      this.props.nextGamePage(this.props.game.id)
    }, 2000)
  }

  render() {
    const { game, isBackgroundPlaying } = this.props
    const { titleEn, sorting } = game
    const { successes, fails, pipe, pipePosition, pipeRotate } = sorting

    const { showResults, correct, indexToShow } = this.state
    return (
      <Background background={sorting.background}>
        {sorting.backgroundMusic && (
          <BackgroundAudio
            music={sorting.backgroundMusic.src}
            loop={sorting.backgroundMusic.repeat}
            isPlaying={true}
          />
        )}
        {pipe && (
          <img
            src={pipe}
            className={`sorting-pipe ${
              pipePosition && pipePosition === 'right' ? 'right' : 'top'
            }`}
            style={{
              transform: `rotate(${pipeRotate}deg)`
            }}
            alt=""
          />
        )}
        {showResults && (
          <div
            className={classNames('results', {
              correct: correct,
              incorrect: !correct
            })}
          >
            <div
              className={classNames('animated', {
                pulse: correct,
                shake: !correct
              })}
            >
              <i className={correct ? 'ti-check ' : 'ti-close'} />
              <span>
                {correct
                  ? successes && indexToShow > -1 && successes[indexToShow].text
                    ? successes[indexToShow].text
                    : ''
                  : fails && indexToShow > -1 && fails[indexToShow].text
                    ? fails[indexToShow].text
                    : ''}{' '}
              </span>
            </div>
          </div>
        )}
        <SortingArea
          onSuccess={this.onSuccess}
          onError={this.onError}
          moveToTrash={this.moveToTrash}
          title={titleEn}
          {...sorting}
        />
      </Background>
    )
  }
}

export default connect(
  state => ({
    game: state.games.getIn(['active', 'current']).toJS() || '',
    loading: state.games.getIn(['active', 'loading']),
    isBackgroundPlaying: state.games.getIn(['game', 'isBackgroundPlaying'])
  }),
  dispatch =>
    bindActionCreators(
      {
        removeElement,
        setSortingResults,
        nextGamePage,
        toggleBackgroundPlaying
      },
      dispatch
    )
)(SortingLayoutContainer)
