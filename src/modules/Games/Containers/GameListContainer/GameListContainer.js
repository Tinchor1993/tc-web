import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loading from '../../../Dashboard/Components/Loading/Loading'
import './GameListContainer.scss'
import { Link } from 'react-router'
import {
  needReload,
  getAll,
  startGame,
  authorize
} from '../../Actions/GamesActions'

class GameListContainer extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    const meta = {}
    this.props.getAll(meta)
  }

  render() {
    const { games = [], loading } = this.props

    if (!loading && games.length === 0) {
      return (
        <div className="container">
          <div className="logo">
            <img src="/images/logo.png" />
          </div>

          {loading ? (
            <Loading />
          ) : (
            <h2 className="error-title">Sorry no games for you to play!</h2>
          )}
        </div>
      )
    } else {
      return (
        <div className="container">
          <div className="logo">
            <img src="/images/logo.png" />
          </div>
          <div className="game-list-wrapper row">
            {loading ? (
              <Loading />
            ) : (
              games.filter(item => !item.draft).map((game, index) => (
                <div key={index} className="game-item-wrapper col-md-2">
                  <div
                    className={`game-item ${game.isPlayed ? 'isPlayed' : ''}`}
                  >
                    {/*<Link to={`/games/${game.id}`} onClick={(e) => (game.isPlayed && e.preventDefault())}>*/}
                    <Link to={`/games/${game.id}`}>
                      <div className="lock">
                        <i className="ti-lock"> </i>
                      </div>
                      <div className="game-image">
                        {game.preview != 'null' ? (
                          <img src={game.preview} alt={game.titleEn} />
                        ) : (
                          <i className="ti-file" />
                        )}
                      </div>
                      <div className="game-title">{game.titleEn}</div>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )
    }
  }
}

export default connect(
  state => ({
    games: state.games.getIn(['games', 'grid', 'list']).toJS() || [],
    loading: state.games.getIn(['games', 'grid', 'loading'])
  }),
  dispatch =>
    bindActionCreators(
      {
        getAll
      },
      dispatch
    )
)(GameListContainer)
