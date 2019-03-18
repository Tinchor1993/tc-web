import http from 'http'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import initializeDb from './db'
import middleware from './middleware'

import api from './api/index'
import config from '../config'
import Passport from './passport/index'

let app = express()
app.server = http.createServer(app)

app.use(morgan('dev'))
app.use(bodyParser.json({}))

initializeDb(({db, s3}) => {
  Passport(app)

  app.use(middleware({ config, s3, db }))
  app.use(`${config.api.prefix}/`, api({ config, s3, db }))

  const DIST_DIR = path.join(__dirname, '../dist'),
    HTML_FILE = path.join(DIST_DIR, 'index.html')

  console.info('SERVE DIST AT', DIST_DIR)
  console.info('PUBLIC PATH', HTML_FILE)

  app.use(express.static(DIST_DIR))
  app.get('*', (req, res) => res.sendFile(HTML_FILE))
  
  app.server.listen(8080, () => {
    console.log(`Started on port ${app.server.address().port}`)
  })
})

export default app
