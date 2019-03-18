import React, { PropTypes } from 'react'
import className from 'classnames'

import './Content.scss'

const Content = ({ id, children, title, showTitle, nextTitle }) => (
  <div className={className(`content page-${id}`)}>
    <div className="inner">{children}</div>
  </div>
)

Content.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  nextTitle: PropTypes.string
}

export default Content
