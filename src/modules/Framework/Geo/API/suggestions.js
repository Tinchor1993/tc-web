import axios from 'axios'

import { API_URL } from '../../API/Constants'

export function countries() {
  const url = `${API_URL}/countries`
  return axios.get(url).then(res => res.data)
}

export function states(countryId) {
  if (!countryId) return Promise.resolve([])
  const url = `${API_URL}/countries/${countryId}/states/`
  return axios.get(url).then(res => res.data)
}

export function districts(countryId, stateId) {
  if (!stateId) return Promise.resolve([])
  const url = `${API_URL}/countries/${countryId}/states/${stateId}/districts`
  return axios.get(url).then(res => res.data)
}

export function municipalities(countryId, stateId, districtId) {
  if (!districtId) return Promise.resolve([])
  const url = `${API_URL}/countries/${countryId}/states/${stateId}/districts/${
    districtId
  }/municipalities`
  return axios.get(url).then(res => res.data)
}
