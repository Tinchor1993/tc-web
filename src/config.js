const config =
  process.env.NODE_ENV === 'production'
    ? require('./config.prod.json')
    : require('./config.dev.json')

export const apiUrl = `${config.api.url}${config.api.prefix}/v${
  config.api.version
}`

export default config
