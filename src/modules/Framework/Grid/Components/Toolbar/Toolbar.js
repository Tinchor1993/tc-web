import React, { PropTypes } from 'react'
import './Toolbar.scss'

import ExportButton from '../../../ExportButton'

export const Toolbar = ({
  exports,
  actions,
  onRefresh,
  onAdd,
  onEdit,
  onRemove,
  onExport,
  canRefresh = true,
  canRemove = false,
  canEdit = false,
  canAdd = true
}) => (
  <div className="toolbar btn-toolbar" role="toolbar">
    {exports ? (
      <div className="pull-left">
        <div className="no-margin" role="export">
          <ExportButton
            onChoose={(data, type) => onExport(data, type)}
            format="CSV"
          >
            Export CSV
          </ExportButton>
          <ExportButton
            onChoose={(data, type) => onExport(data, type)}
            format="PDF"
          >
            Export PDF
          </ExportButton>
        </div>
      </div>
    ) : null}

    {actions ? (
      <div className="pull-right">
        <div
          className="btn-group btn-group-sm"
          role="remove"
          onClick={onRefresh}
        >
          <button
            type="button"
            className="btn btn-default"
            disabled={!canRefresh}
          >
            Refresh
          </button>
        </div>
        <div
          className="btn-group btn-group-sm"
          role="remove"
          onClick={onRemove}
        >
          <button
            type="button"
            className="btn btn-default"
            disabled={!canRemove}
          >
            Remove
          </button>
        </div>
        <div className="btn-group btn-group-sm" role="edit" onClick={onEdit}>
          <button type="button" className="btn btn-default" disabled={!canEdit}>
            Edit
          </button>
        </div>
        <div className="btn-group btn-group-sm" role="add" onClick={onAdd}>
          <button type="button" className="btn btn-default" disabled={!canAdd}>
            Add
          </button>
        </div>
      </div>
    ) : null}
  </div>
)

Toolbar.propTypes = {
  exports: PropTypes.bool,
  actions: PropTypes.bool,

  onRefresh: PropTypes.func,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onEdit: PropTypes.func,
  onExport: PropTypes.func,

  canRefresh: PropTypes.bool,
  canRemove: PropTypes.bool,
  canCancel: PropTypes.bool,
  canEdit: PropTypes.bool,
  canAdd: PropTypes.bool
}

export default Toolbar
