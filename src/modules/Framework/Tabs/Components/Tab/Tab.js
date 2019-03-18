import React, { PropTypes } from 'react'
import classNames from 'classnames'

import { Link } from 'react-router'

const Tab = ({ id, isActive, onClick, hashedUrl, title }) => (
  <li className={classNames({ active: isActive })} onClick={() => onClick(id)}>
    <Link to={hashedUrl}>{title}</Link>
  </li>
)

Tab.propTypes = {
  id: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  hashedUrl: PropTypes.string,
  title: PropTypes.string
}

export default Tab
