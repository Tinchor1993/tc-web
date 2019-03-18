import React, { PropTypes } from 'react'

const TabContent = ({ id, children }) => <div key={id}>{children}</div>

TabContent.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
}

export default TabContent
