import React, { PropTypes } from 'react'
import classNames from 'classnames'

import './ExportButton.scss'

import { ALL, SELECTED } from '../../Constants/actions'

export const ExportButton = ({ open, children, onClick, onChoose }) => (
  <div
    className={classNames('btn-group btn-group-sm btn-export', { open: open })}
  >
    <button
      type="button"
      className="btn btn-default"
      onClick={e => onChoose(SELECTED, e)}
    >
      {children}
    </button>
    <button
      type="button"
      className="btn btn-default dropdown-toggle"
      onClick={onClick}
    >
      <span className="caret" />
    </button>
    <ul className="dropdown-menu">
      <li onClick={e => onChoose(ALL, e)}>
        <a>All</a>
      </li>
      <li role="separator" className="divider">
        &nbsp;
      </li>
      <li onClick={e => onChoose(SELECTED, e)}>
        <span>Selected</span>
      </li>
    </ul>
  </div>
)

ExportButton.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  onClick: PropTypes.func,
  onChoose: PropTypes.func
}

export default ExportButton
