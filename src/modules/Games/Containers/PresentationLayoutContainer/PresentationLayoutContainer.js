import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import './PresentationLayoutContainer.scss'
import BackgroundAudio from '../../Componetns/BackgroundAudio/BackgroundAudio'

import {
  TitleSubtitle,
  Bullets,
  PhotoHorizontal,
  PhotoVertical,
  PhotoFull,
  TitleCenter,
  TitleTop,
  TitleBullets,
  TitleBulletsPhoto,
  Quote,
  Blank
} from '../PresentationSlider'

import {
  setSlide,
  nextGamePage,
  toggleBackgroundPlaying
} from '../../Actions/GamesActions'

import SlideLayoutContainer from '../../Containers/SlideLayoutContainer/SlideLayoutContainer'
import PresentationProgressBar from '../../Containers/PresentationProgressBar/PresentationProgressBar'

const isSlideActive = (index, activeIndex) => index === activeIndex

const isSlideAnimated = (index, activeIndex) => index === activeIndex

const KEYS = {
  SPACE: 32,
  KEY_LEFT: 37,
  KEY_RIGHT: 39
}

const DEFAULT_ANIMATION = 'none'

class PresentationLayoutContainer extends Component {
  constructor() {
    super()

    this.handleKey = this.handleKey.bind(this)

    this.canNext = this.canNext.bind(this)
    this.canPrev = this.canPrev.bind(this)

    this.next = this.next.bind(this)
    this.prev = this.prev.bind(this)
    this.stop = this.stop.bind(this)
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKey)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey)
  }

  handleKey(e) {
    const { keyCode } = e

    if (keyCode === KEYS.KEY_LEFT) {
      e.preventDefault()
      this.prev()
      return
    }

    if (keyCode === KEYS.KEY_RIGHT) {
      e.preventDefault()
      this.next()
      // alert('next slide')
      return
    }

    if (keyCode === KEYS.SPACE) {
      e.preventDefault()
      this.next()
      // alert('next slide')
      return
    }
  }

  getSliderLayout() {
    return <TitleSubtitle />
  }

  getBackgroundClassNameList() {
    return `paper`
  }

  renderSlides(slides = [], stopPlaying) {
    const { activeSlide } = this.props

    return slides.map((slide, index) => (
      <li
        key={index}
        style={{ order: isSlideActive(index, activeSlide) ? 0 : index + 1 }}
      >
        <div
          className={classNames('slide', {
            animated: isSlideAnimated(index, activeSlide),
            [slide.settings.animation || DEFAULT_ANIMATION]: isSlideAnimated(
              index,
              activeSlide
            )
          })}
        >
          <SlideLayoutContainer
            {...slide}
            isLocalPlaying={isSlideActive(index, activeSlide)}
            stopPlaying={stopPlaying}
          />
        </div>
      </li>
    ))
  }

  getSlidesCount() {
    return this.props.presentation.slides.length
  }

  canNext() {
    return this.props.activeSlide + 1 < this.getSlidesCount()
  }

  canPrev() {
    return this.props.activeSlide - 1 > -1
  }

  next() {
    const slidesCount = this.getSlidesCount() - 1
    if (!this.props.isBackgroundPlaying) {
      this.props.toggleBackgroundPlaying()
    }
    if (!this.canNext()) {
      if (this.props.activeSlide >= slidesCount) {
        this.props.nextGamePage()
      }

      return
    }

    this.props.setSlide(this.props.activeSlide + 1)
  }

  prev() {
    if (!this.canPrev()) return
    if (!this.props.isBackgroundPlaying) {
      this.props.toggleBackgroundPlaying()
    }

    this.props.setSlide(this.props.activeSlide - 1)
  }

  stop() {
    // this.props.toggleBackgroundPlaying();
  }

  render() {
    const { children, id } = this.props
    const { presentation, isBackgroundPlaying } = this.props

    return (
      <div
        className={classNames(
          'game-container',
          this.getBackgroundClassNameList()
        )}
      >
        <div style={{ position: 'fixed' }}>
          {/*<p>active: {this.props.activeSlide}</p>*/}
          {/*<p>all: {this.getSlidesCount()}</p>*/}
        </div>
        <div className="presentation-slider">
          <button className="step-button button-left" onClick={this.prev} />

          <ul className="slides">
            {this.renderSlides(presentation.slides, this.stop)}
          </ul>
          <BackgroundAudio
            music={presentation.backgroundMusic.src}
            isPlaying={isBackgroundPlaying}
            loop={presentation.backgroundMusic.repeat}
          />
          <button className="step-button button-right" onClick={this.next} />
        </div>

        <PresentationProgressBar />
      </div>
    )
  }
}

export default connect(
  state => ({
    presentation:
      state.games.getIn(['active', 'current', 'presentation']).toJS() || {},
    isBackgroundPlaying: state.games.getIn(['game', 'isBackgroundPlaying']),
    activeSlide: state.games.getIn(['presentation', 'active']) || 0,
    loading: state.games.getIn(['active', 'loading'])
  }),
  dispatch =>
    bindActionCreators(
      {
        setSlide,
        nextGamePage,
        toggleBackgroundPlaying
      },
      dispatch
    )
)(PresentationLayoutContainer)
