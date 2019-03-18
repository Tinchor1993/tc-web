import React, { Component, PropTypes } from 'react'

import ExportButton from '../Components/ExportButton/ExportButton'

export class ExportButtonContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    onChoose: PropTypes.func,
    format: PropTypes.string
  }

  constructor() {
    super()

    this.state = {
      open: false
    }

    this.toggle = this.toggle.bind(this)
    this.select = this.select.bind(this)
  }

  toggle() {
    this.setState({ open: !this.state.open })
  }

  select(type) {
    this.props.onChoose(this.props.format, type)
    this.setState({ open: false })
  }

  render() {
    const { children } = this.props
    const { open } = this.state

    return (
      <ExportButton onClick={this.toggle} open={open} onChoose={this.select}>
        {children}
      </ExportButton>
    )
  }
}

export default ExportButtonContainer
