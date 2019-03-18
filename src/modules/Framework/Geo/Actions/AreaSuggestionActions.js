import {
  countries,
  states,
  districts,
  municipalities
} from '../API/suggestions'

export const GET_COUNTRIES_REQUEST = 'GET_COUNTRIES_REQUEST'
export const GET_COUNTRIES_SUCCESS = 'GET_COUNTRIES_SUCCESS'
export const GET_COUNTRIES_FAIL = 'GET_COUNTRIES_FAIL'

export const GET_STATES_REQUEST = 'GET_STATES_REQUEST'
export const GET_STATES_SUCCESS = 'GET_STATES_SUCCESS'
export const GET_STATES_FAIL = 'GET_STATES_FAIL'

export const GET_DISTRICTS_REQUEST = 'GET_DISTRICTS_REQUEST'
export const GET_DISTRICTS_SUCCESS = 'GET_DISTRICTS_SUCCESS'
export const GET_DISTRICTS_FAIL = 'GET_DISTRICTS_FAIL'

export const GET_MUNICIPALITIES_REQUEST = 'GET_MUNICIPALITIES_REQUEST'
export const GET_MUNICIPALITIES_SUCCESS = 'GET_MUNICIPALITIES_SUCCESS'
export const GET_MUNICIPALITIES_FAIL = 'GET_MUNICIPALITIES_FAIL'

/**
 * COUNTRIES
 **/
export function getCountries() {
  return dispatch => {
    dispatch(getCountriesRequest())

    countries()
      .then(data => dispatch(getCountriesSuccess(data)))
      .catch(err => dispatch(getCountriesFail(err)))
  }
}

export function getCountriesRequest() {
  return {
    type: GET_COUNTRIES_REQUEST
  }
}

export function getCountriesSuccess(data) {
  return {
    type: GET_COUNTRIES_SUCCESS,
    payload: {
      data
    }
  }
}

export function getCountriesFail(error) {
  return {
    type: GET_COUNTRIES_SUCCESS,
    payload: {
      error
    }
  }
}

/**
 * STATES
 **/
export function getCountryStates(countryId) {
  return dispatch => {
    dispatch(getCountriesRequest())

    states(countryId)
      .then(data => dispatch(getCountriesSuccess(data)))
      .catch(err => dispatch(getCountriesFail(err)))
  }
}

export function getCountryStatesRequest() {
  return {
    type: GET_COUNTRIES_REQUEST
  }
}

export function getCountryStatesSuccess(data) {
  return {
    type: GET_COUNTRIES_SUCCESS,
    payload: {
      data
    }
  }
}

export function getCountryStatesFail(error) {
  return {
    type: GET_COUNTRIES_FAIL,
    payload: {
      error
    }
  }
}

/**
 * DISTRICTS
 **/
export function getStateDistricts(countryId, stateId) {
  return dispatch => {
    dispatch(getStateDistrictsRequest())

    districts(countryId, stateId)
      .then(data => dispatch(getStateDistrictsSuccess(data)))
      .catch(err => dispatch(getStateDistrictsFail(err)))
  }
}

export function getStateDistrictsRequest() {
  return {
    type: GET_DISTRICTS_REQUEST
  }
}

export function getStateDistrictsSuccess(data) {
  return {
    type: GET_DISTRICTS_SUCCESS,
    payload: {
      data
    }
  }
}

export function getStateDistrictsFail(error) {
  return {
    type: GET_DISTRICTS_FAIL,
    payload: {
      error
    }
  }
}

/**
 * DISTRICTS
 **/
export function getStateMunicipalities(countryId, stateId, districtId) {
  return dispatch => {
    dispatch(getDistrictMunicipalitiesRequest())

    municipalities(countryId, stateId, districtId)
      .then(data => dispatch(getDistrictMunicipalitiesSuccess(data)))
      .catch(err => dispatch(getDistrictMunicipalitiesFail(err)))
  }
}

export function getDistrictMunicipalitiesRequest() {
  return {
    type: GET_DISTRICTS_REQUEST
  }
}

export function getDistrictMunicipalitiesSuccess(data) {
  return {
    type: GET_DISTRICTS_SUCCESS,
    payload: {
      data
    }
  }
}

export function getDistrictMunicipalitiesFail(error) {
  return {
    type: GET_DISTRICTS_FAIL,
    payload: {
      error
    }
  }
}
