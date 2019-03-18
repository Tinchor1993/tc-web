import React, { Component } from 'react'
import { noop, isEmpty } from 'lodash'
import axios from 'axios'

import ReactSelect from 'react-select'

import Request from '../../Framework/API/Request'

import './AudioUploadField.scss'

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

export const AUDIO_LEVELS = [
  {
    value: 'quiet',
    label: 'Quiet',
    icon: 'ti-desktop'
  },
  {
    value: 'normal',
    label: 'Normal',
    icon: 'ti-desktop'
  },
  {
    value: 'loud',
    label: 'Loud',
    icon: 'ti-desktop'
  }
]

const VOLUME_MAP = {
  quiet: 0.5,
  normal: 0.8,
  loud: 1
}

const DEFAULT_LEVEL = 'normal'

const AUDIO_FILES_API_URL = '/api/v1/files/music?size=100'
const SERVER_URL = 'tca-image-uploads.s3.amazonaws.com'

const endsWith = (str = '', suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1

export const isAudio = str => endsWith(str, '.mp3') || endsWith(str, '.wav')

class AudioUploadField extends Component {
  defaultProps = {
    defaultOn: false
  }

  constructor() {
    super()

    this.getAudios = this.getAudios.bind(this)
    this.selectAudio = this.selectAudio.bind(this)
    this.onFileChoosen = this.onFileChoosen.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.updateAudioList = this.updateAudioList.bind(this)

    this.setAudioPlayerRef = element => {
      this.audioPlayer = element;
    }
    this.state = {
      loading: false,
      uploading: false,
      action: null,
      files: []
    }
  }

  componentDidMount() {
    if (!isEmpty(this.props.input.value)) {
      this.setState({ action: UPLOAD_STATE })
    }

    this.getAudios()
  }

  setLoading(loading) {
    this.setState({ loading })
  }

  onFileChoosen(e) {
    const files = e.target.files
    if (!files.length) return
    this.setLoading(true)
    Request.upload(`/api/v1/files/upload`, files)
      .then(({ data }) => {
        this.setLoading(false)
        this.updateAudioList(data)
        this.changeSrc(data.url)
      })
      .catch(err => {
        this.setLoading(false)
      })
  }

  updateAudioList(data) {
    const { files } = this.state
    const file = {
      label: data.pretty,
      value: data.url
    }

    const nextFiles = [file, ...files]

    this.setState({ files: nextFiles })
  }

  toggleUploadMode() {
    this.setState({ uploading: !this.state.uploading })
  }

  fetchFiles(name = '') {
    return axios
      .get(AUDIO_FILES_API_URL)
      .then(res => res.data)
      .then(files =>
        files.map(({ Key, pretty }) => ({
          label: pretty,
          value: `https://${SERVER_URL}/${Key}`
        }))
      )
  }

  getAudios(query) {
    return this.fetchFiles(query).then(options => {
      this.setState({ files: options })
    })
  }

  changeInputValue = nextValue => {
    const {
      input: { onChange = noop }
    } = this.props

    onChange(nextValue)
  }

  getValue = () => {
    const {
      input: { value }
    } = this.props

    return value
  }

  getStateOptions() {
    return [SELECT_STATE, UPLOAD_STATE]
  }

  onActionChange(action) {
    this.setState({ action })
  }

  changeSrc(src) {
    const curValue = this.getValue()
    const nextValue = {
      ...curValue,
      src
    }

    this.changeInputValue(nextValue)
  }

  toggleOn(on) {
    const curValue = this.getValue()
    const nextValue = {
      ...curValue,
      on
    }

    this.changeInputValue(nextValue)
  }

  changeDelay(delay) {
    const curValue = this.getValue()
    const nextValue = {
      ...curValue,
      delay
    }

    this.changeInputValue(nextValue)
  }

  toggleRepeat(repeat) {
    const curValue = this.getValue()
    const nextValue = {
      ...curValue,
      repeat
    }

    this.changeInputValue(nextValue)
  }

  handleOnOfChange = e => this.toggleOn(e.target.checked)

  handleRepeat = e => this.toggleRepeat(e.target.checked)

  selectAudio = item => {
    if (!item) {
      const on = this.props.input.value && this.props.input.value.on

      return this.changeInputValue(
        this.normalize({
          on
        })
      )
    }

    this.changeSrc(item.value)
  }

  delayUpdate = e => this.changeDelay(e.target.value)

  renderValue = ({ label }) => <b>{label}</b>
  renderOption = ({ label }) => <span>{label}</span>

  changeAudioLevel = ({ value }) => {
    const curValue = this.getValue()

    console.log('v' + VOLUME_MAP[value])
    this.audioPlayer.volume = VOLUME_MAP[value]
    const nextValue = {
      ...curValue,
      level: value
    }

    this.changeInputValue(nextValue)
  }

  renderVolumeOptions = level => (
    <ReactSelect
      value={level}
      options={AUDIO_LEVELS}
      onChange={this.changeAudioLevel}
      valueRenderer={item => <b>{item.label}</b>}
      optionRenderer={item => <b>{item.label}</b>}
    />
  )

  normalize = ({ src = null, on = this.props.defaultOn, repeat = false, delay = 0, level = DEFAULT_LEVEL }) => ({
    src,
    on,
    repeat,
    delay,
    level
  })

  render() {
    const {
      input: { value, onBlur = noop, onChange = noop },
      options,
      defaultOn,
      attributes = true,
      ...props
    } = this.props

    const { src, on, repeat, delay, level } = this.normalize(value)
    const { files, loading } = this.state

    if (loading) {
      return (
        <div className="audio-field">
          <div className="loading-container">
            <Loading />
          </div>
        </div>
      )
    }

    return (
      <div className="audio-field">
        {!defaultOn && (
          <label>
            <input type="checkbox" defaultChecked={on} onChange={this.handleOnOfChange} /> On
          </label>
        )}

        {loading && <Loading />}

        {on && (
          <div className="attributes">
            <div>
              <br />
              <div className="file-upload-container">
                <span className="btn btn-default btn-file">
                  <i className="ti-upload" />
                  <input ref="file" onChange={e => this.onFileChoosen(e)} type="file" />
                </span>
              </div>
            </div>
            
            <div>
              <br />
              <ReactSelect
                value={src}
                options={files}
                onChange={this.selectAudio}
                valueRenderer={this.renderValue}
                optionRenderer={this.renderOption}
              />
            </div>

            <div>
              <br />
              {this.renderVolumeOptions(level)}
            </div>

            {!isEmpty(src) && <audio ref={this.setAudioPlayerRef} src={src} controls={true} style={{ width: `100%`, margin: '10px 0' }} />}

            {attributes && (
              <div>
                <label>Delay</label>
                <br />
                <input type="number" defaultValue={delay} onChange={this.delayUpdate} />
                {'  '}
                <label>
                  <input type="checkbox" defaultChecked={repeat} onChange={this.handleRepeat} /> Repeat
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default AudioUploadField
