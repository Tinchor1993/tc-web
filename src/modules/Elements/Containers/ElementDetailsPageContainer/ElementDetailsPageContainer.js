import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'

import { updateBreadcrumbs } from '../../../Dashboard/Actions/LayoutActions'

import {
  getSingle as getElement,
  remove as removeElement
} from '../../Actions/ElementListActions'

import Loading from '../../../Dashboard/Components/Loading/Loading'

import ElementDetails from '../../Components/ElementDetails/ElementDetails'

class ElementPageContainer extends Component {
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

    this.props.getElement(this.props.id)
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
        path: `/dashboard/elements/${props.id}`,
        label: `${props.element.titleEn}`
      }
    ]
  }

  getId() {
    return this.props.elements.id
  }

  getEditLink() {
    const id = this.getId()

    return `/dashboard/elements/${id}/edit`
  }

  onDelete(id, creationDate) {
    this.props.removeElement(id, creationDate)
  }

  render() {
    const { element, loading } = this.props

    return (
      <div className="container">
        {loading ? (
          <Loading />
        ) : (
          <ElementDetails {...element} onDelete={this.onDelete} />
        )}
      </div>
    )
  }
}

export default connect(
  state => ({
    element: state.elements.getIn(['active', 'current']).toJS() || {},
    loading: state.elements.getIn(['active', 'loading']) || false
  }),
  dispatch =>
    bindActionCreators(
      {
        updateBreadcrumbs,
        getElement,
        removeElement
      },
      dispatch
    )
)(ElementPageContainer)
