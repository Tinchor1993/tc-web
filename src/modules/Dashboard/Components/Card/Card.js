import React from 'react'
import { Link } from 'react-router'

import './Card.scss'

const Card = ({ children, col = 2, to = '/', className = '' }) => (
  <div className={`card-wrapper col-md-${col}`}>
    <Link className={`card ${className}`} to={to}>
      {children}
    </Link>
  </div>
)

export default Card
