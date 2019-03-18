import React, { PropTypes } from 'react'

import './Content.scss'

const Content = ({ children }) => (
  <div className="thinking-content">{children}</div>
)

Content.propTypes = {
  children: PropTypes.node
}

export default Content
