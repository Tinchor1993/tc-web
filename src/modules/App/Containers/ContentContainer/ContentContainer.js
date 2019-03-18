import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { updatePageTitle } from '../../Actions/AppActions'

import Content from '../../Components/Content/Content'

class ContentContainer extends Component {
  static propTypes = {
    updatePageTitle: PropTypes.func,

    children: PropTypes.node,
    id: PropTypes.string,

    title: PropTypes.string,
    customTitle: PropTypes.string
  }

  constructor() {
    super()
  }

  componentWillMount() {
    const pageTitle = this.getTitle(this.props)
    this.props.updatePageTitle(pageTitle)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.shouldUpdateTitle(this.props.title, nextProps.title) ||
      this.shouldUpdateTitle(this.props.customTitle, nextProps.customTitle)
    ) {
      const pageTitle = this.getTitle(nextProps)
      this.props.updatePageTitle(pageTitle)
    }
  }

  shouldUpdateTitle(currentTitle, nextTitle) {
    return currentTitle !== nextTitle
  }

  getTitle(props) {
    const { title, customTitle } = props

    if (customTitle) {
      return customTitle
    }

    return title
  }

  render() {
    const { id, children, fluid } = this.props
    const { backTo, nextTo, backTitle, nextTitle } = this.props
    const title = this.getTitle(this.props)
    const showTitle = !!this.props.title

    return (
      <Content title={title} showTitle={showTitle} id={id}>
        {children}
      </Content>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    title: ownProps.title,
    customTitle: ownProps.customTitle
  }),
  dispatch =>
    bindActionCreators(
      {
        updatePageTitle
      },
      dispatch
    )
)(ContentContainer)
