import React, { Component } from 'react'
import { noop, isEmpty } from 'lodash'
import axios from 'axios'
import classNames from 'classnames'

import ReactSelect from 'react-select'

import Request from '../../Framework/API/Request'

import './ElementField.scss'

import FileInput from 'react-file-input'
import Loading from '../../Dashboard/Components/Loading/Loading'

const ELEMENTS_API_URL = '/api/v1/elements'

export const renderFile = ({ descriptionEn, media }) => (
  <div>
    <div
      className="element-image-preview"
      style={{ 'background-image': `url("${media}")` }}
    />
    <p className="element-preview-description">
      {!!descriptionEn && descriptionEn}
    </p>
  </div>
)

class ElementField extends Component {
  constructor() {
    super()

    this.onActionChange = this.onActionChange.bind(this)

    this.onFileChoosen = this.onFileChoosen.bind(this)
    this.getElements = this.getElements.bind(this)
    this.selectFile = this.selectFile.bind(this)

    this.state = {
      loading: false,
      uploading: false,
      action: null,
      files: []
    }
  }

  componentWillMount() {}

  onFileChoosen(e) {
    const files = e.target.files
    if (!files.length) return

    this.setLoading(true)
    Request.upload(`/api/v1/files/upload`, files)
      .then(({ data }) => {
        this.setLoading(false)
        this.toggleUploadMode()
        this.props.input.onChange(data.url)
      })
      .catch(err => {
        this.setLoading(false)
      })
  }

  setLoading(loading) {
    this.setState({ loading })
  }

  renderPreview() {
    let src = this.props.input.value

    return (
      <div
        className={classNames('preview')}
        onClick={() => this.toggleUploadMode()}
      >
        {isEmpty(src.media) || src.media === 'null' ? (
          <div className="empty">
            <i className="ti-file" />
            <p>EMPTY</p>
          </div>
        ) : (
          renderFile(src)
        )}
      </div>
    )
  }

  onActionChange(action) {
    this.setState({ action })
  }

  fetchElements() {
    return axios
      .get(ELEMENTS_API_URL)
      .then(res => res.data)
      .then(elements =>
        elements.map(({ media, titleEn, id, descriptionEn }) => ({
          label: titleEn,
          value: {
            titleEn,
            media,
            id,
            descriptionEn
          }
        }))
      )
  }

  getElements(query) {
    return this.fetchElements().then(options => {
      console.log(options)
      return { options }
    })
  }

  selectFile(item) {
    if (!item) return

    const fileName = item.value
    this.props.input.onChange(fileName)
  }

  renderValue({ titleEn }) {
    return <b>{titleEn}</b>
  }

  renderOption({ value }) {
    return (
      <div>
        <img className="preview-img-grid" src={value.media} width={50} />
      </div>
    )
  }

  render() {
    const {
      input: { value, onBlur = noop, onChange = noop },
      options,
      ...props
    } = this.props

    const { action, files } = this.state

    return (
      <div className="element">
        <div className="chooser">
          <div>
            <ReactSelect.Async
              value={value}
              loadOptions={this.getElements}
              onChange={this.selectFile}
              valueRenderer={this.renderValue}
              optionRenderer={this.renderOption}
            />
            <br />
            <div
              className={classNames('element-preview', {
                small: this.props.small
              })}
            >
              {value && this.renderPreview()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ElementField
