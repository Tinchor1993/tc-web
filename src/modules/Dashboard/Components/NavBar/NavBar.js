import React, { PropTypes } from 'react'
import classNames from 'classnames'
import './NavBar.scss'

import { Link } from 'react-router'
import { default as NavItems } from '../../Constants/NavigationItems'

const BASE_PATH = '/dashboard'

const isPathActive = (path, currentPath) => {
  return path.indexOf(currentPath) > -1
}

const NavBar = ({ onLogout, pn }) => (
  <nav className="navbar thinking-navbar">
    <div className="container-fluid">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/dashboard">
          Thinking Cap App CMS
        </Link>
      </div>

      <div
        className="collapse navbar-collapse"
        id="bs-example-navbar-collapse-1"
      >
        <ul className="nav navbar-nav">
          {NavItems.map((item, index) => (
            <li key={index}>
              <Link
                to={`${BASE_PATH}${item.path}`}
                activeClassName={`active`}
                className={classNames({
                  active: isPathActive(pn, `${BASE_PATH}${item.path}`)
                })}
              >
                <i className={classNames('icon', `ti-${item.icon}`)} />
                <span className="name">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav navbar-nav navbar-right">
          <button
            type="button"
            className="btn btn-default navbar-btn profile-btn"
            onClick={onLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </nav>
)

export default NavBar
