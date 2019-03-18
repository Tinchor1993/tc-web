import React from 'react'

import './Page.scss'

const Page = ({ children, id = '', title }) => (
  <div className={`page ${id}`}>
    <div className="page-wrapper">
      {title && <h3 className="title">{title}</h3>}
      <div className="inner">{children}</div>
    </div>
  </div>
)

export default Page
