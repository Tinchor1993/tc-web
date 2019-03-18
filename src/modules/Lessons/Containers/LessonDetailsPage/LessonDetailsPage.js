import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  getSingle as getSingleLesson,
  remove as removeLesson
} from '../../Actions/LessonsActions'

import { LessonDetails } from '../../Components'

import Loading from '../../../Dashboard/Components/Loading/Loading'

class LessonDetailsPage extends Component {
  static propTypes = {
    children: PropTypes.node,

    id: PropTypes.string,

    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()

    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs(this.props)
    this.props.updateBreadcrumbs(breadcrumbs)

    this.props.getSingleLesson(this.props.id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lesson.id !== nextProps.lesson.id) {
      const breadcrumbs = this.getBreadcrumbs(nextProps)
      this.props.updateBreadcrumbs(breadcrumbs)
    }
  }

  getBreadcrumbs(props) {
    return [
      {
        path: '/dashboard',
        label: 'Dashboard'
      },
      {
        path: '/dashboard/lessons',
        label: 'Lessons'
      },
      {
        path: `/dashboard/lessons/${props.lesson.id}`,
        label: props.lesson.titleEn
      }
    ]
  }

  onDelete(id, creationDate) {
    this.props.removeLesson(id, creationDate)
  }

  render() {
    const { lesson, loading } = this.props

    return (
      <div>
        {loading && lesson ? (
          <Loading />
        ) : (
          <LessonDetails
            {...lesson}
            onRemove={this.onDelete}
            loading={loading}
          />
        )}
      </div>
    )
  }
}

export default connect(
  state => ({
    lesson: state.lessons.getIn(['active', 'current']).toJS() || {},
    loading: state.lessons.getIn(['active', 'loading'])
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getSingleLesson,
        removeLesson
      },
      dispatch
    )
)(LessonDetailsPage)
