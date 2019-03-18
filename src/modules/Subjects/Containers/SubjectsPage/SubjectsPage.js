import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import { getList as getSubjects } from '../../Actions/SubjectsActions'

import { SubjectsList } from '../../Components/'
import Loading from '../../../Dashboard/Components/Loading/Loading'

class SubjectsPage extends Component {
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

    this.props.getSubjects()
  }

  getBreadcrumbs() {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      },
      {
        path: '/dashboard/subjects',
        label: 'Subjects'
      }
    ]
  }

  render() {
    const { list, loading } = this.props

    return (
      <div className="container">
        {loading ? <Loading /> : <SubjectsList subjects={list} />}
      </div>
    )
  }
}

export default connect(
  state => ({
    loading: state.subjects.getIn(['grid', 'loading']) || false,
    list: state.subjects.getIn(['grid', 'list']).toJS() || []
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getSubjects
      },
      dispatch
    )
)(SubjectsPage)
