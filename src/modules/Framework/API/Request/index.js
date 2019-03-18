import axios from 'axios'
import { noop } from 'lodash'
import qs from 'qs'

const extendOptions = options => {
  return {
    ...options
  }
}

const jsToFormData = data => {
  return qs.stringify(data)
}

const getRequest = (url, options = {}) => {
  options = extendOptions(options)

  return axios.get(url, options)
}

const postRequest = (url, data = {}, options = {}) => {
  options = extendOptions(options)
  return axios.post(url, data, options)
}

const postFromDataRequest = (url, data = {}, options = {}) => {
  options = extendOptions(options)

  data = jsToFormData(data)

  return axios.post(url, data, options)
}

const deleteRequest = (url, options = {}) => {
  options = extendOptions(options)
  return axios.delete(url, options)
}

const putRequest = (url, data = {}, options = {}) => {
  options = extendOptions(options)

  return axios.put(url, data, options)
}

const uploadRequest = (
  url,
  files = [],
  config = {},
  onUploadProgress = noop
) => {
  const data = new FormData()
  data.append('file', files[0])

  return axios.post(url, data, config)
}

export default {
  get: getRequest,
  post: postRequest,
  postFormData: postFromDataRequest,
  upload: uploadRequest,
  delete: deleteRequest,
  put: putRequest
}
