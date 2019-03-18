import React, { Component } from 'react'
import { noop, isEmpty } from 'lodash'

import './IconField.scss'

import icons from './iconsList'

const nameEquals = (name, realName) => name === realName

const getIcon = (name = '') => {
  name = name.toLowerCase()

  return icons.filter(icon => icon.name.indexOf(name) > -1)
}

import Icon from './Icon'

class IconField extends Component {
  constructor() {
    super()

    this.chooseIcon = this.chooseIcon.bind(this)
    this.filterChange = this.filterChange.bind(this)

    this.state = {
      choosing: false,
      filter: ''
    }
  }

  renderIcons() {
    const filteredIcons = getIcon(this.state.filter)

    return filteredIcons.map((icon, index) => (
      <Icon key={index} {...icon} onClick={this.chooseIcon} />
    ))
  }

  isChoosen() {
    return !isEmpty(this.props.input.value)
  }

  isChoosingMode() {
    return this.state.choosing
  }

  toggleeChooseMode() {
    this.setState({ choosing: !this.state.choosing })
  }

  chooseIcon(name) {
    this.props.input.onChange(name)
    this.toggleeChooseMode()
  }

  emptyState() {
    return (
      <div className="empty">
        <Icon large nomargin name={'file'} />
        <p className="placeholder">Empty</p>
      </div>
    )
  }

  filterChange(e) {
    const { value } = e.target

    this.setState({
      filter: value
    })
  }

  render() {
    const {
      input: { value, onBlur = noop, onChange = noop },
      options,
      ...props
    } = this.props

    return (
      <div className="icon-field">
        {this.isChoosingMode() ? (
          <div className="form">
            <div className="inner">
              <input
                className="filter-field"
                type="text"
                defaultValue={this.state.filter}
                onChange={this.filterChange}
              />
            </div>
            <div className="set">{this.renderIcons()}</div>
          </div>
        ) : (
          <div className="icon" onClick={() => this.toggleeChooseMode()}>
            {isEmpty(value) ? (
              this.emptyState()
            ) : (
              <Icon large nomargin name={value} />
            )}
          </div>
        )}
      </div>
    )
  }
}

export default IconField
