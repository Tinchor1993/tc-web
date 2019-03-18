import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import filter from 'lodash/filter'

import Toolbar from '../../Components/Toolbar/Toolbar'
import GridContainer from '../GridContainer/GridContainer'

import {
  register,
  setReadMode,
  selectAll,
  unselectAll,
  selectRow,
  unselectRow
} from '../../Actions/GridActions'
import { getSelectedRows } from '../../Helpers'

import { ALL, SELECTED } from '../../../ExportButton/Constants/actions'

class DataGridContainer extends Component {
  static propTypes = {
    name: PropTypes.string,
    bootstrap: PropTypes.bool,

    toolbar: PropTypes.object,

    columns: PropTypes.array,
    source: PropTypes.arrayOf(PropTypes.object),

    readonly: PropTypes.bool,
    loading: PropTypes.bool,

    onRefresh: PropTypes.func,
    onAdd: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onExport: PropTypes.func,

    register: PropTypes.func.isRequired,
    selectedRows: PropTypes.array,

    selectRow: PropTypes.func.isRequired,

    unselectRow: PropTypes.func.isRequired,
    unselectAll: PropTypes.func.isRequired,

    selectable: PropTypes.bool,
    defaultPageSize: PropTypes.number
  }

  constructor() {
    super()

    this.isRowSelected = this.isRowSelected.bind(this)
    this.onRowSelect = this.onRowSelect.bind(this)

    this.canEditRow = this.canEditRow.bind(this)
    this.canRemoveRows = this.canRemoveRows.bind(this)

    this.onRefresh = this.onRefresh.bind(this)
    this.onRowEdit = this.onRowEdit.bind(this)
    this.onRowsRemove = this.onRowsRemove.bind(this)
    this.onRowsExport = this.onRowsExport.bind(this)
  }

  getConfig() {
    return {}
  }

  componentDidMount() {
    const config = this.getConfig()
    const { name } = this.props

    if (!name) {
      throw Error('Grid name is not specified')
    }

    this.props.register(name, config)

    if (this.isAutoBootstrap()) {
      this.onRefresh()
    }
  }

  isAutoBootstrap() {
    return this.props.bootstrap
  }

  onRowSelect(row, selected) {
    const { name } = this.props

    if (selected) {
      this.props.selectRow(name, row)
    } else {
      this.props.unselectRow(name, row)
    }
  }

  isRowSelected(id) {
    const { selectedRows } = this.props
    return filter(selectedRows, rowId => rowId === id).length > 0
  }

  hasSelectedRows() {
    return this.props.selectedRows.length > 0
  }

  canEditRow() {
    return this.props.selectedRows.length === 1
  }

  canRemoveRows() {
    return this.hasSelectedRows()
  }

  canRefresh() {
    return true
  }

  onRefresh() {
    this.props.onRefresh()
  }

  onRowEdit() {
    const rowId = this.props.selectedRows[0]
    if (!rowId) return
    this.props.onEdit(rowId)
    this.unsellectAllRows()
  }

  onRowsRemove() {
    const { selectedRows } = this.props
    this.props.onRemove(selectedRows)
    this.unsellectAllRows()
  }

  onRowsExport(data, type) {
    const { selectedRows } = this.props
    if (type === ALL) {
      const ids = this.props.source.map(row => row.id)
      this.props.onExport(data, type, ids)
    } else {
      this.props.onExport(data, type, selectedRows)
    }
    this.unsellectAllRows()
  }

  unsellectAllRows() {
    const { name } = this.props
    this.props.unselectAll(name)
  }

  render() {
    const { toolbar, bootstrap } = this.props
    const {
      columns,
      source,
      readonly,
      loading,
      selectable,
      selectedRows,
      onAdd,
      defaultPageSize,
      pagination
    } = this.props
    let toolbarConfig = toolbar || {}

    return (
      <div className="data-grid-container">
        {toolbar ? (
          <Toolbar
            exports={toolbarConfig.exports}
            actions={toolbarConfig.actions}
            onRefresh={this.onRefresh}
            onAdd={onAdd}
            onRemove={this.onRowsRemove}
            onEdit={this.onRowEdit}
            onExport={this.onRowsExport}
            canRefresh={this.canRefresh()}
            canEdit={this.canEditRow()}
            canRemove={this.canRemoveRows()}
          />
        ) : null}

        <GridContainer
          selectable={selectable}
          pagination={pagination}
          bootstrap={bootstrap}
          columns={columns}
          source={source}
          loading={loading}
          readonly={readonly}
          defaultPageSize={defaultPageSize}
          selectedRows={selectedRows}
          onRowSelect={this.onRowSelect}
          rowSelection={this.isRowSelected}
        />
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    name: ownProps.name,
    selectedRows: getSelectedRows(state.grid, ownProps.name)
  }),
  dispatch =>
    bindActionCreators(
      {
        register,
        setReadMode,
        selectAll,
        unselectAll,
        selectRow,
        unselectRow
      },
      dispatch
    )
)(DataGridContainer)
