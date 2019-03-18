// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync'
import historyApiFallback from 'connect-history-api-fallback'
import { chalkProcessing } from './chalkConfig'

/* eslint-disable no-console */
const isProduction = process.env.NODE_ENV === 'dev'
const origin = isProduction
  ? 'http://localhost:4000'
  : 'http://ec2-34-204-166-173.compute-1.amazonaws.com:49160'
console.log(chalkProcessing('Opening production build...'))

const proxyMiddleware = require('http-proxy-middleware')
import globalConfig from '../src/config.js'
const APIProxy = proxyMiddleware('/api', {
  target: globalConfig.api.url,
  changeOrigin: false,
  headers: {
    origin: origin
  }
})

// Run Browsersync
browserSync({
  port: 4000,
  ui: {
    port: 4001
  },
  server: {
    baseDir: 'dist'
  },

  files: ['src/*.html'],

  middleware: [APIProxy, historyApiFallback()]
})
