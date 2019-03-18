import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Loading from '../../../Dashboard/Components/Loading/Loading'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  getSingle as getSubject,
  remove as removeSubject
} from '../../Actions/SubjectsActions'

import { SubjectDetails } from '../../Components'

import Page from '../../../Dashboard/Components/Page/Page'

import '../../Components/SubjectDetails/SubjectDetails.scss'

class SubjectDetailsPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()

    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs(this.props)
    this.props.updateBreadcrumbs(breadcrumbs)

    this.props.getSubject(this.props.id)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subject.id !== nextProps.subject.id) {
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
        path: '/dashboard/subjects',
        label: 'Subjects'
      },
      {
        path: `/dashboard/subjects/${props.subject.id}`,
        label: `${props.subject.titleEn}`
      }
    ]
  }

  getId() {
    return this.props.subject.id
  }

  getEditLink() {
    const id = this.getId()

    return `/dashboard/subjects/${id}/edit`
  }

  onDelete(id, creationDate) {
    this.props.removeSubject(id, creationDate)
  }

  render() {
    const { subject, loading } = this.props

    const editLink = this.getEditLink()

    return (
      <div className="container">
        {loading ? (
          <Loading />
        ) : (
          <Page>
            <SubjectDetails
              {...subject}
              editLink={editLink}
              onDelete={this.onDelete}
            />
          </Page>
        )}
      </div>
    )
  }
}

export default connect(
  state => ({
    subject: state.subjects.getIn(['active', 'current']).toJS() || {},
    loading: state.subjects.getIn(['active', 'loading'])
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getSubject,
        removeSubject
      },
      dispatch
    )
)(SubjectDetailsPage)
