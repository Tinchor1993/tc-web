import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Page from '../../../Dashboard/Components/Page/Page'
import StudentsToolBar from '../../Components/StudentsToolBar/StudentsToolBar'

import { push } from 'react-router-redux'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  getList as getStudentsList,
  exportTo
} from '../../Actions/StudentsActions'

import { Grid } from '../../../Framework/Grid'

class LessonsContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()

    this.onAdd = this.onAdd.bind(this)
    this.export = this.export.bind(this)
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs()
    this.props.updateBreadcrumbs(breadcrumbs)

    this.props.getStudentsList()
  }

  getBreadcrumbs() {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      },
      {
        path: '/dashboard/students',
        label: 'Students'
      }
    ]
  }

  onAdd() {
    this.props.push(`/dashboard/students/invite`)
  }

  export(type) {
    const user = {}
    this.props.exportTo(type, user)
  }

  extendColumns() {
    return this.props.columns.map(col => col)
  }

  render() {
    const { data } = this.props
    const extendedColumns = this.extendColumns()

    return (
      <div className="container">
        <Page title="Students">
          <StudentsToolBar onInvite={this.onAdd} />

          <Grid
            name="students"
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
    data: state.students.getIn(['grid', 'list']).toJS(),
    columns: state.students.getIn(['columns']).toJS()
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getStudentsList,
        exportTo,
        push
      },
      dispatch
    )
)(LessonsContainer)
