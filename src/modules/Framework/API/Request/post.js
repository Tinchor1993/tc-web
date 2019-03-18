import axios from 'axios'

const post = (url, options) => {
  return axios.post(url, options)
}

export default post
