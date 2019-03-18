import React, { Component, PropTypes } from 'react'

import ReactTable from 'react-table'

import './GridContianer.scss'
import filter from 'lodash/filter'
import { Debug } from '../../../Debug'

import SelectRow from '../../Components/SelectRow/SelectRow'
import CheckboxField from '../../../../Framework/Forms/Components/Inputs/CheckboxField/CheckboxField'

export class GridContainer extends Component {
  static propTypes = {
    onRowSelect: PropTypes.func,
    rowSelection: PropTypes.func,

    source: PropTypes.array,
    columns: PropTypes.array,
    pagination: PropTypes.bool,
    loading: PropTypes.bool,
    selectable: PropTypes.bool,

    selectedRows: PropTypes.array
  }

  constructor() {
    super()

    this.rowSelect = this.rowSelect.bind(this)
    this.isAllRowsSelected = this.isAllRowsSelected.bind(this)
    this.selectAllRows = this.selectAllRows.bind(this)
  }

  getRowById(id) {
    const { source } = this.props
    return source.filter(row => row.id === id)
  }

  rowSelect(row, selected, e) {
    e.preventDefault()
    this.props.onRowSelect(row, selected)
  }

  isAllRowsSelected() {
    const { selectedRows, source } = this.props

    return source.length > 0 && selectedRows.length === source.length
  }

  selectAllRows(col, selected, e) {
    e.preventDefault()
    const { source } = this.props

    source.forEach(row => {
      this.props.onRowSelect(row, selected)
    })

    return false
  }

  render() {
    const {
      source = [],
      columns,
      loading,
      selectable = true,
      pagination = false
    } = this.props
    const { rowSelection, defaultPageSize = 10 } = this.props
    let gridColumns = [...columns]

    if (selectable) {
      const selectCol = {
        header: props => (
          <SelectRow
            row={{ id: 'all' }}
            onChange={this.selectAllRows}
            checked={this.isAllRowsSelected()}
          />
        ),
        accessor: 'selected',
        width: 40,
        render: ({ row }) => (
          <SelectRow
            row={row}
            onChange={this.rowSelect}
            checked={rowSelection(row.id)}
          />
        )
      }

      gridColumns.unshift(selectCol)
    }

    return (
      <div className="grid">
        <ReactTable
          noDataText=""
          defaultPageSize={defaultPageSize}
          selectable={selectable}
          loading={loading}
          data={source}
          columns={gridColumns}
          showPagination={pagination}
          getTrProps={(state, rowInfo, column, instance) => {
            const isSelected =
              !rowInfo || !rowInfo.row ? false : rowSelection(rowInfo.row.id)

            return {
              className: isSelected ? 'selected' : ' ',
              onClick: e => {
                this.rowSelect(rowInfo.row, !isSelected, e)
              }
            }
          }}
        />
      </div>
    )
  }
}

export default GridContainer
