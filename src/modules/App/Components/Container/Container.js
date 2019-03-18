import React, { PropTypes } from 'react'

import './Container.scss'

export const Container = ({ children }) => (
  <div className="container-fluid container-app">
    <div className="row">{children}</div>
  </div>
)

Container.propTypes = {
  children: PropTypes.node
}

export default Container
