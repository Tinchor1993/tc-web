import axios from 'axios'
import reduce from 'lodash/reduce'
import qs from 'qs'

const MAPS_API_URL = 'http://nominatim.openstreetmap.org/search/'

export const urlFormat = url => {
  return url + '?format=json&addressdetails=1&limit=1&polygon_svg=1'
}

export const proccessResponse = data => {
  return data.length > 0 ? data[0] : null
}

export const resolveByQuery = query => {
  const resolveUrl = MAPS_API_URL + encodeURIComponent(query)
  return axios
    .get(urlFormat(resolveUrl))
    .then(res => proccessResponse(res.data))
}

export const resolveByParams = params => {
  const query = reduce(
    params,
    function(str, val) {
      val = val ? val + ' ' : ''
      return str + val
    },
    ''
  )

  return resolveByQuery(query)
}
