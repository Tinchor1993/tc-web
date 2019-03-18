import React, { Component } from 'react'
import './LayoutToggleField.scss'
import { noop } from 'lodash'
import classNames from 'classnames'

const TEXT = 'TEXT'
const MEDIA = 'MEDIA'
const ALL = 'ALL'

const LAYOUT_TYPES = [TEXT, MEDIA, ALL]

class LayoutToggleField extends Component {
  constructor() {
    super()

    this.handleClick = this.handleClick.bind(this)
    this.isActive = this.isActive.bind(this)
  }

  handleClick(type) {
    this.props.input.onChange(type)
  }

  isActive(type) {
    return this.props.input.value === type
  }

  render() {
    const { input: { value, name, onChange = noop } } = this.props
    return (
      <div className="toggle-wrapper">
        <button
          className={classNames('toggle-btn', { active: this.isActive(TEXT) })}
          type="button"
          onClick={() => this.handleClick(TEXT)}
        >
          <span>
            <i className="ti-text toggle-icon" />Only text
          </span>
        </button>

        <button
          type="button"
          className={classNames('toggle-btn', { active: this.isActive(MEDIA) })}
          onClick={() => this.handleClick(MEDIA)}
        >
          <span>
            <i className="ti-files toggle-icon" />Only media
          </span>
        </button>

        <button
          type="button"
          className={classNames('toggle-btn', { active: this.isActive(ALL) })}
          onClick={() => this.handleClick(ALL)}
        >
          <span>
            <i className="ti-layout-media-center toggle-icon" />Both
          </span>
        </button>
      </div>
    )
  }
}
export default LayoutToggleField
