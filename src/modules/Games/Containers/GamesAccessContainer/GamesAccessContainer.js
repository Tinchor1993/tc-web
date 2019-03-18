import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import '../../../../styles/components/buttons.scss'

import {
  needReload,
  getSingle as getGame,
  startGame,
  authorize,
  getIsPlayed
} from '../../Actions/GamesActions'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class GamesAccessContainer extends Component {
  constructor() {
    super()
  }

  componentWillMount() {
    const { id, hasAccess, location } = this.props

    if (location.pathname.indexOf('/token') > -1) {
      const userData = JSON.parse(location.query.user)
      return this.props.authorize(id, userData)
    }

    if (location.pathname.indexOf('/no-access') > -1) {
      return
    }
    
    if (!hasAccess) {
      return this.props.push(`/games/no-access`)
    } else {
      return this.props.push(`/games/list`)
    }
  }

  render() {
    const { children } = this.props
    const { params, location } = this.props
    return <div>{children}</div>
  }
}

export default connect(
  state => ({
    hasAccess: state.games.getIn(['hasAccess'])
  }),
  dispatch =>
    bindActionCreators(
      {
        push,
        authorize
      },
      dispatch
    )
)(GamesAccessContainer)
