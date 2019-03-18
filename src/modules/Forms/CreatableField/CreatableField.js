import React, { Component } from 'react'
import { noop, isArray, isObject } from 'lodash'
import { Creatable } from 'react-select'

import Request from '../../Framework/API/Request'

import axios from 'axios'
import './CreatableField.scss'

class AutocompleteField extends Component {
  constructor() {
    super()

    this.onChange = this.onChange.bind(this)
    this.create = this.create.bind(this)

    this.state = {
      value: []
    }
  }

  componentWillMount() {
    const { value } = this.props.input

    if (isObject(value)) {
      this.setState({
        value
      })
    }
  }

  getValues() {
    return this.state.values
  }

  onChange(data) {
    if (!data) {
      return this.props.input.onChange(null, {})
    }

    this.props.input.onChange(data)
  }

  optionCreator = option => {
    return option
  }

  create(option) {
    this.onChange(option)
    return option
  }

  textCreator(label) {
    return `Add option "${label}"`
  }

  render() {
    const {
      input: { value, onBlur = noop, onChange = noop },
      ...props
    } = this.props

    return (
      <Creatable
        ref="select"
        {...props}
        value={value}
        onBlur={() => onBlur()}
        onChange={this.onChange}
      />
    )
  }
}

export default AutocompleteField
