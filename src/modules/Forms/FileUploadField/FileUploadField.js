import React, { Component } from 'react'
import { noop, isEmpty } from 'lodash'
import axios from 'axios'
import classNames from 'classnames'

import ReactSelect from 'react-select'

import Request from '../../Framework/API/Request'

import './FileUploadField.scss'

import FileInput from 'react-file-input'
import Loading from '../../Dashboard/Components/Loading/Loading'

const SELECT_STATE = {
  value: 'select',
  label: 'Select From Library',
  icon: 'ti-gallery'
}
const UPLOAD_STATE = {
  value: 'upload',
  label: 'Upload From Desktop',
  icon: 'ti-desktop'
}

const FILES_API_URL = '/api/v1/files'
const AUDIO_FILES_API_URL = '/api/v1/files/music'
const SERVER_URL = 'https://tca-image-uploads.s3.amazonaws.com'

const FORMATS = '.png, .gif, .jpeg, .jpg, .mp3, .wav, .avi, .mpeg, .mp4, .webm'
const MAX_SIZE = 5

const getExtension = src => /(?:\.([^.]+))?$/.exec(src)[1]

const endsWith = (str = '', suffix) => str.toLowerCase().indexOf(suffix, str.length - suffix.length) !== -1

export const isAudio = str => endsWith(str, '.mp3') || endsWith(str, '.wav')
export const isVideo = str =>
  endsWith(str, '.avi') || endsWith(str, '.mpeg') || endsWith(str, '.mp4') || endsWith(str, '.webm')

export const isPicture = str =>
  endsWith(str, '.jpeg') || endsWith(str, '.png') || endsWith(str, '.jpg') || endsWith(str, '.gif')

export const renderFile = (src = '') => {
  if (isVideo(src)) {
    return <video style={{ width: `100%` }} controls src={src} />
  }

  if (isAudio(src)) {
    return <audio style={{ width: `100%` }} controls src={src} />
  }

  if (isPicture(src)) {
    return <img src={src} style={{ width: `auto`, height: `100%` }} />
  }

  return <div>Unsupported file type ".{getExtension(src)}"</div>
}

class FileUploadField extends Component {
  constructor() {
    super()

    this.onActionChange = this.onActionChange.bind(this)
    this.toggleUploadMode = this.toggleUploadMode.bind(this)

    this.onFileChoosen = this.onFileChoosen.bind(this)
    this.getFiles = this.getFiles.bind(this)
    this.selectFile = this.selectFile.bind(this)

    this.state = {
      loading: false,
      uploading: false,
      action: null,
      files: [],
      fileName: ''
    }
  }

  componentDidMount() {
    if (!isEmpty(this.props.input.value)) {
      this.setState({ action: UPLOAD_STATE })
      this.setState({ fileName: this.props.input.value })
    }
  }

  isUploading() {
    return this.state.uploading
  }

  resetState = () => {
    this.setState({ fileName: '' })
  }

  onFileChoosen(e) {
    const files = e.target.files
    if (!files.length) return

    this.setLoading(true)
    Request.upload(`/api/v1/files/upload`, files)
      .then(({ data }) => {
        this.setLoading(false)
        this.toggleUploadMode()
        this.props.input.onChange(data.url)
        this.setState({ fileName: data.url })
      })
      .catch(err => {
        this.setLoading(false)
      })
  }

  toggleUploadMode() {
    this.setState({ uploading: !this.state.uploading })
  }

  setLoading(loading) {
    this.setState({ loading })
  }

  valueRenderer(opt) {
    console.dir(opt)
  }

  renderUpload() {
    return (
      <div className="empty">
        <h4>Upload Files</h4>

        {this.state.loading ? (
          <div className="loading">
            <Loading />
          </div>
        ) : (
          <div className="upload-button ti-upload">
            <FileInput
              name="file"
              accept={FORMATS}
              placeholder="My Image"
              className="controller"
              onChange={this.onFileChoosen}
            />
          </div>
        )}

        <br />
        <div className="text-center">
          <p>Supported {FORMATS}.</p>Number of lessons
          <p>{' '}</p>
          <p>Max File Size is {MAX_SIZE}mb</p>
        </div>
      </div>
    )
  }

  renderPreview() {
    let src = this.state.fileName

    return (
      <div className={classNames('preview')} onClick={() => this.toggleUploadMode()}>
        {isEmpty(src) || src === 'null' ? (
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

  getStateOptions() {
    return [SELECT_STATE, UPLOAD_STATE]
  }

  onActionChange(action) {
    this.setState({ action })
  }

  fetchFiles(name = 'name') {
    const { onlyAudio } = this.props
    const fetchUrl = onlyAudio ? `${AUDIO_FILES_API_URL}/${name}` : `${FILES_API_URL}/${name}`
    return axios
      .get(fetchUrl)
      .then(res => res.data)
      .then(files =>
        files.map(({ Key, pretty }) => ({
          label: pretty,
          value: `${SERVER_URL}/${Key}`
        }))
      )
  }

  getFiles(query) {
    return this.fetchFiles(query).then(options => {
      return { options }
    })
  }

  selectFile(item) {
    if (!item) return

    const fileName = item.value
    this.props.input.onChange(fileName)
    this.setState({ fileName: fileName })
  }

  renderValue({ label }) {
    if (isVideo(label)) {
      return (
        <div>
          <i className="ti-video-clapper" /> {label}
        </div>
      )
    }

    if (isAudio(label)) {
      return (
        <div>
          <i className="ti-music-alt" /> {label}
        </div>
      )
    }

    if (isPicture(label)) {
      return (
        <div>
          <i className="ti-image" /> {label}
        </div>
      )
    }

    return <b>{label}</b>
  }

  renderOption({ value, label }) {
    if (isVideo(value)) {
      return (
        <div className="option-item">
          <i className="ti-video-clapper" />
          <div>
            <strong>{label}</strong>
          </div>
        </div>
      )
    }

    if (isAudio(value)) {
      return (
        <div className="option-item">
          <i className="ti-music-alt" />
          <div>
            <strong>{label}</strong>
          </div>
        </div>
      )
    }

    if (isPicture(value)) {
      return (
        <div className="option-item">
          <img className="preview-img-grid" src={value} width={50} />
          <div>
            <strong>{label}</strong>
          </div>
        </div>
      )
    }

    return <div />
  }

  renderStateOption({ label, icon }) {
    return (
      <div>
        <i className={icon} /> {label}
      </div>
    )
  }

  render() {
    const {
      input: { value, onBlur = noop, onChange = noop },
      options,
      ...props
    } = this.props

    const { action, fileName, loading } = this.state

    let component = <div />

    if (action && action === UPLOAD_STATE) {
      component = (
        <div
          className={classNames('file-upload-field', {
            small: this.props.small
          })}
        >
          {this.isUploading() ? this.renderUpload() : this.renderPreview()}
        </div>
      )
    }

    if (action && action === SELECT_STATE) {
      component = (
        <div>
          <div className="select-files-field">
            <ReactSelect.Async
              value={fileName}
              loadOptions={this.getFiles}
              onChange={this.selectFile}
              valueRenderer={this.renderValue}
              optionRenderer={this.renderOption}
              ignoreCase={true}
              clearable={false}
            />
            <span className="Select-clear-zone" onClick={this.resetState}>
              <span className="Select-clear">×</span>
            </span>
          </div>
          <br />
          <div
            className={classNames('file-upload-field', {
              small: this.props.small
            })}
          >
            {this.renderPreview()}
          </div>
        </div>
      )
    }

    return (
      <div className="file">
        <ReactSelect
          value={action}
          options={this.getStateOptions()}
          onChange={this.onActionChange}
          searchable={false}
          optionRenderer={this.renderStateOption}
          valueRenderer={this.renderStateOption}
        />

        <div className="chooser">{component}</div>
      </div>
    )
  }
}

export default FileUploadField
