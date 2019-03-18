import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Textarea from 'react-textarea-autosize'

export default class TextField extends Component {
  static propTypes = {
    normalize: PropTypes.func,
    textarea: PropTypes.bool,
    type: PropTypes.string,
    immediate: PropTypes.bool,
    input: PropTypes.shape({
      onBlur: PropTypes.func,
      value: PropTypes.string
    })
  }

  static defaultProps = {
    normalize: value => value,
    onBlur: () => {},
    textarea: false,
    immediate: false,
    type: 'text'
  }

  state = {
    value: this.props.input.value
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.input.value) {
      this.setState({ value: nextProps.input.value })
    }
  }

  handleChange = event => {
    const { normalize, immediate, input: { onBlur } } = this.props
    const value = normalize(event.target.value)
    this.setState({ value })
    if (immediate) {
      onBlur(value)
    }
  }

  handleBlur = event => {
    this.setState({ value: event.target.value })
    if (this.props.value !== this.state.value) {
      this.props.input.onBlur(this.state.value)
    }
  }

  handleKeyDown = event => {
    const { textarea, input: { onBlur } } = this.props
    if (!textarea && event.keyCode === 13) {
      onBlur(this.state.value)
    }
  }

  render() {
    const { value } = this.state
    const { textarea, fixed, ...props } = this.props
    if (textarea) {
      if (fixed) {
        return (
          <textarea
            {...props}
            value={value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
          />
        )
      }
      return (
        <Textarea
          {...props}
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
        />
      )
    }
    return (
      <input
        {...props}
        value={value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
      />
    )
  }
}
