import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from '../../../Dashboard/Components/Loading/Loading'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import { getList as getLessonsList } from '../../Actions/LessonsActions'

import { LessonsList } from '../../Components'

class LessonsContainer extends Component {
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

    const meta = {}

    this.props.getLessonsList(meta)
  }

  getBreadcrumbs() {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      },
      {
        path: '/dashboard/lessons',
        label: 'Lessons'
      }
    ]
  }

  render() {
    const { list, loading } = this.props
    return (
      <div className="container">
        {loading ? <Loading /> : <LessonsList lessons={list} />}
      </div>
    )
  }
}

export default connect(
  state => ({
    loading: state.lessons.getIn(['grid', 'loading']) || false,
    list: state.lessons.getIn(['grid', 'list']).toJS() || []
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getLessonsList
      },
      dispatch
    )
)(LessonsContainer)
