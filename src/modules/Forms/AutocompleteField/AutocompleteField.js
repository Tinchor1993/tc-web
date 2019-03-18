import React, { Component } from 'react'
import { noop, isEmpty, isObject } from 'lodash'
import ReactSelect, { AsyncCreatable } from 'react-select'

import Request from '../../Framework/API/Request'

import axios from 'axios'
import './AutocompleteField.scss'

class AutocompleteField extends Component {
  constructor() {
    super()

    this.getOptions = this.getOptions.bind(this)
    this.onChange = this.onChange.bind(this)
    this.addNew = this.addNew.bind(this)

    this.state = {
      value: ''
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

  componentWillReceiveProps(next) {}

  createQuery(url, query) {
    return `${url}?q=${query}`
  }

  getOptions(input) {
    const val = input || this.props.input.value

    const queryEndpoint = !isEmpty(val)
      ? this.props.endpoint
      : this.props.endpoint.replace('filter', '')

    return Request.get(this.createQuery(queryEndpoint, val))
      .then(response => {
        return response.data.map(opt => ({
          value: opt[this.props.idKey],
          label: opt[this.props.labelKey],
          data: opt
        }))
      })
      .then(options => {
        return { options }
      })
  }

  onChange(item) {
    this.setState({ value: item })
    if (!item) {
      return this.props.input.onChange(null, {})
    }

    if (this.props.multi) {
      this.props.input.onChange(item)
    } else {
      if (this.props.old) {
        this.props.input.onChange(item.value, item.data)
      } else {
        this.props.input.onChange(item, item.data)
      }
    }
  }

  addNew(data) {
    const { addEndpoint } = this.props

    return axios
      .post(addEndpoint, data)
      .then(response => {
        const { id } = response.data

        const item = {
          value: id,
          label: data.label
        }

        this.onChange(item)
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    const {
      input: { value, onBlur = noop, onChange = noop },
      creatable,
      ...props
    } = this.props

    if (creatable) {
      return (
        <AsyncCreatable
          ref="select"
          {...props}
          value={this.state.value}
          onBlur={() => onBlur()}
          onChange={this.onChange}
          loadOptions={this.getOptions}
          onNewOptionClick={this.addNew}
          valueKey={'value'}
          labelKey={'label'}
          ignoreCase
        />
      )
    }

    return (
      <ReactSelect.Async
        ref="select"
        {...props}
        value={value}
        onBlur={() => onBlur()}
        onChange={this.onChange}
        loadOptions={this.getOptions}
        valueKey={'value'}
        labelKey={'label'}
        ignoreCase
      />
    )
  }
}

export default AutocompleteField
