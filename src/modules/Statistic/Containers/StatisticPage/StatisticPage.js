import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Page from '../../../Dashboard/Components/Page/Page'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import { Grid } from '../../../Framework/Grid'

class StatisticContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs()
    this.props.updateBreadcrumbs(breadcrumbs)
  }

  getBreadcrumbs() {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      },
      {
        path: '/dashboard/statistic',
        label: 'Statistic'
      }
    ]
  }

  onAdd() {
    alert('add')
  }

  extendColumns() {
    return this.props.columns.map(col => col)
  }

  render() {
    const { data } = this.props
    const extendedColumns = this.extendColumns()

    return (
      <div className="container">
        <Page title="Statistic">
          <br />
          <Grid
            name="statistic"
            bootstrap={false}
            columns={extendedColumns}
            source={data}
            readonly={false}
            loading={false}
            selectable={true}
            selectedRows={[]}
            onAdd={this.onAdd}
            defaultPageSize={10}
            pagination={false}
          />
        </Page>
      </div>
    )
  }
}

export default connect(
  state => ({
    data: state.statistic.getIn(['grid', 'list']).toJS(),
    columns: state.statistic.getIn(['columns']).toJS()
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs
      },
      dispatch
    )
)(StatisticContainer)
