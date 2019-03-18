const PROD_MODE = process.env.NODE_ENV === 'production'

const SERVER_URL_PROD = 'http://localhost:8080'
const SERVER_URL_DEV = 'http://localhost:8080'

const SERVER_URL = PROD_MODE ? SERVER_URL_PROD : SERVER_URL_DEV

const API_URL_DEV = `${SERVER_URL}/api/v1`
const API_URL_PROD = `${SERVER_URL}/api/v1` // TODO: configure state/prod server url

export const API_URL = PROD_MODE ? API_URL_PROD : API_URL_DEV
console.info('API url is', API_URL)
