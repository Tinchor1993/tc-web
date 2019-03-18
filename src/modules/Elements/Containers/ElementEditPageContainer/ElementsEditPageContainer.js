import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  getSingle as getElement,
  update as updateElement,
  create as createElement
} from '../../Actions/ElementListActions'

import Loading from '../../../Dashboard/Components/Loading/Loading'
import Page from '../../../Dashboard/Components/Page/Page'
import EditForm from '../../Forms/Edit'

const DEFAULT_FOLDER_TYPE = 'new'

class ElementEditPageContainer extends Component {
  static propTypes = {
    updateBreadcrumbs: PropTypes.func
  }

  constructor() {
    super()

    this.update = this.update.bind(this)
  }

  componentWillMount() {
    const breadcrumbs = this.getBreadcrumbs(this.props)
    this.props.updateBreadcrumbs(breadcrumbs)

    if (this.isEditMode()) {
      this.props.getElement(this.props.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.element.id !== nextProps.element.id) {
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
        path: '/dashboard/elements',
        label: 'Elements'
      },
      {
        path: `/dashboard/elements/${props.element.id}`,
        label: this.isEditMode() ? `Edit "${props.element.titleEn}"` : 'Create'
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
      ? `/dashboard/elements/${id}`
      : `/dashboard/elements`
  }

  update(data) {
    if (this.isEditMode()) {
      if (typeof data.type === 'object') {
        data.type = data.type.value
      }
      if (typeof data.folder === 'object') {
        data.folder = data.folder.value
      }
      this.props.updateElement(this.getId(), data)
    } else {
      this.props.createElement(data)
    }
  }

  render() {
    const { element, loading, folderType } = this.props

    const editMode = this.isEditMode()
    const cancelLink = this.getCancelLink()

    const initialValues = editMode
      ? element
      : { folderType: DEFAULT_FOLDER_TYPE }

    return (
      <div className="container">
        {loading ? (
          <Loading />
        ) : (
          <Page
            title={editMode ? `Edit "${element.titleEn}"` : `Create Element`}
          >
            <EditForm
              initialValues={initialValues}
              editMode={editMode}
              cancelLink={cancelLink}
              folderType={folderType}
              onSubmit={this.update}
            />
          </Page>
        )}
      </div>
    )
  }
}
const selector = formValueSelector('editElement')

export default connect(
  state => ({
    folderType: selector(state, `folderType`),
    element: state.elements.getIn(['active', 'current']).toJS() || {},
    loading: state.elements.getIn(['active', 'loading'])
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getElement,
        updateElement,
        createElement
      },
      dispatch
    )
)(ElementEditPageContainer)
