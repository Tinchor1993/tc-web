import React, { PropTypes } from 'react'
import classNames from 'classnames'
import './Breadcrumbs.scss'

import { Link } from 'react-router'
import { default as NavItems } from '../../Constants/NavigationItems'

const Breadcrumbs = ({ breadcrumbs }) => (
  <ol className="breadcrumb thinking-breadcrumb">
    {breadcrumbs.map((crumb, index) => (
      <li
        className={classNames({ active: index === breadcrumbs.length - 1 })}
        key={index}
      >
        {index !== breadcrumbs.length - 1 ? (
          <Link to={`${crumb.path}`}>{crumb.label}</Link>
        ) : (
          <span>{crumb.label}</span>
        )}
      </li>
    ))}
  </ol>
)

export default Breadcrumbs
