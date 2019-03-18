import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Page from '../../../Dashboard/Components/Page/Page'
import StudentsToolBar from '../../Components/StudentsToolBar/StudentsToolBar'

import InviteStudentForm from '../../Components/InviteStudentForm/InviteStudentForm'

import { push } from 'react-router-redux'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  getList as getStudentsList,
  invite as inviteStudent
} from '../../Actions/StudentsActions'

class InviteStudentPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()

    this.invite = this.invite.bind(this)
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
      },
      {
        path: '/dashboard/students/invite',
        label: 'Invite'
      }
    ]
  }

  extendColumns() {
    return this.props.columns.map(col => col)
  }

  invite(data) {
    this.props.inviteStudent(data)
  }

  render() {
    const { data } = this.props
    const extendedColumns = this.extendColumns()

    return (
      <Page title="Invite Student">
        <InviteStudentForm onSubmit={this.invite} />
      </Page>
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
        push,
        inviteStudent
      },
      dispatch
    )
)(InviteStudentPage)
