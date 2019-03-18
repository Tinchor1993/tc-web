import React from 'react'
import { noop } from 'lodash'

import '../../../../styles/components/buttons.scss'
import './StudentsToolBar.scss'

const StudentsToolBar = ({ onInvite = noop, onPrint = noop }) => (
  <div className="students-tool-bar">
    <div className="row">
      <div className="col-md-5">
        <button
          className="btn-thc small"
          disabled={true}
          onClick={e => onPrint('pdf')}
        >
          Print PDF
        </button>
        <button
          className="btn-thc small"
          disabled={true}
          onClick={e => onPrint('excel')}
        >
          Excel
        </button>
        <button className="btn-thc small" onClick={onInvite}>
          Invite
        </button>
      </div>
      <div className="col-md-3 col-md-offset-4">
        <div className="tool-bar-form">
          <div className="form-group">
            <input
              type="search"
              className="form-control"
              placeholder="Search"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)
export default StudentsToolBar
