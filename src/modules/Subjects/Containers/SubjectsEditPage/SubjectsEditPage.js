import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Page from '../../../Dashboard/Components/Page/Page'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  getSingle as getSubject,
  create as createSubject,
  update as updateSubject
} from '../../Actions/SubjectsActions'

import Loading from '../../../Dashboard/Components/Loading/Loading'
import EditForm from '../../Forms/Edit'

class SubjectsEditPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    breadcrumbs: PropTypes.array
  }

  constructor() {
    super()

    this.update = this.update.bind(this)
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs(this.props)
    this.props.updateBreadcrumbs(breadcrumbs)

    if (this.isEditMode()) {
      this.props.getSubject(this.props.id)
    }
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
        label: this.isEditMode() ? `Edit "${props.subject.titleEn}"` : 'Create'
      }
    ]
  }

  getId() {
    return this.props.id
  }

  isEditMode() {
    return this.props.id
  }

  getCancelLink() {
    const id = this.getId()

    return this.isEditMode()
      ? `/dashboard/subjects/${id}`
      : `/dashboard/subjects`
  }

  update(data) {
    if (this.isEditMode()) {
      this.props.updateSubject(this.getId(), data)
    } else {
      this.props.createSubject(data)
    }
  }

  render() {
    const { subject, loading } = this.props

    const editMode = this.isEditMode()
    const cancelLink = this.getCancelLink()

    let initialValues = editMode ? subject : {}

    return (
      <div className="container">
        {loading ? (
          <Loading />
        ) : (
          <Page title={editMode ? `Edit "${subject.titleEn}"` : `Create`}>
            <EditForm
              initialValues={initialValues}
              editMode={editMode}
              cancelLink={cancelLink}
              onSubmit={this.update}
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
        createSubject,
        updateSubject
      },
      dispatch
    )
)(SubjectsEditPage)
