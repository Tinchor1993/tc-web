import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import classNames from 'classnames'
import './GameLayoutContainer.scss'

import {
  needReload,
  getSingle as getGame,
  startGame,
  authorize,
  getIsPlayed
} from '../../Actions/GamesActions'

import Loading from '../../../Dashboard/Components/Loading/Loading'

class GameLayoutContainer extends Component {
  constructor() {
    super()

    this.state = {
      background: 'paper'
    }
  }

  componentWillMount() {
    const { id, hasAccess, location } = this.props

    if (location.pathname.indexOf('/token') > -1) {
      const userData = JSON.parse(location.query.user)
      return this.props.authorize(id, userData)
    }

    if (!hasAccess) {
      return this.props.push(`/games/no-access`)
    } else {
      if (needReload(this.props.game, id)) {
        this.props.getGame(id)
      }
    }

    if (location.pathname.indexOf('/no-access') > -1) {
      return
    }
  }

  componentDidMount() {
    // this.props.getIsPlayed(this.props.id);
  }

  componentWillReceiveProps(next) {
    const { id } = next

    if (this.props.hasAccess !== next.hasAccess) {
      if (needReload(this.props.game, id)) {
        this.props.getGame(id)
      }
    }

    if (needReload(this.props.game, next.game.id)) {
      this.props.startGame(next.game.id)
    }
  }

  getBackgroundClassNameList() {
    return this.state.background
  }

  setBackgroundClassNameList(background) {
    this.setState({ background })
  }

  render() {
    const { children, loading } = this.props
    const { game, hasAccess, isPlayed } = this.props
    const component = loading ? <Loading /> : children

    return (
      game && (
        <div
          className={classNames(
            'game-container',
            this.getBackgroundClassNameList()
          )}
        >
          {component}
        </div>
      )
    )
  }
}

export default connect(
  state => ({
    game: state.games.getIn(['active', 'current']).toJS() || {},
    hasAccess: state.games.getIn(['hasAccess']),
    loading: state.games.getIn(['active', 'loading']),
    isPlayed: state.games.getIn(['game', 'isPlayed'])
  }),
  dispatch =>
    bindActionCreators(
      {
        getGame,
        startGame,
        push,
        authorize,
        getIsPlayed
      },
      dispatch
    )
)(GameLayoutContainer)
