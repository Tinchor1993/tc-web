import React from 'react'
import { noop } from 'lodash'
import classNames from 'classnames'
import './IconField.scss'

const Icon = ({ name = '', large, nomargin, onClick = noop }) => (
  <div
    className={classNames('icon-section', {
      large: large,
      'no-margin': nomargin
    })}
    onClick={() => onClick(name)}
  >
    <i className={classNames('icon', `ti-${name}`)} />
  </div>
)

export default Icon
