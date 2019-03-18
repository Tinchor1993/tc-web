'use strict'
const AWS = require('aws-sdk')
const bodyParser = require('body-parser')
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const path = require('path')
const cors = require('cors')
AWS.config.loadFromPath('./awsconfig.json')
const Regex = require('regex')
let regex = new Regex(/.*/)

const app = express()
  .use(session({ secret: 'thinking_capp' }))
  .use(bodyParser.json())
  .use(passport.initialize())
  .use(passport.session())

// const isProduction = (process.env.NODE_ENV === 'dev');
// const whitelist =
//   isProduction
//     ? ['http://localhost:4000']
//     : ['http://ec2-54-215-254-129.us-west-1.compute.amazonaws.com:49160'];
// const corsOptions = {
//
//   origin: function (origin, callback) {
//     console.dir(origin);
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

app.use(
  /*cors(corsOptions),*/ function(req, res, next) {
    /* if (req.headers.referer === undefined){
    return res.send('Not allowed by CORS')
  }*/
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  }
)

const DIST_DIR = path.join(__dirname, 'dist'),
  HTML_FILE = path.join(DIST_DIR, 'index.html')

console.info('SERVE DIST AT', DIST_DIR)
console.info('PUBLIC PATH', HTML_FILE)

app.use(require('./server/index').default)
app.use(express.static(DIST_DIR))
app.get('*', (req, res) => res.sendFile(HTML_FILE))

app.listen(8080, () => {
  console.log('Example app listening at port %s', 8080)
  console.log('CORS-enabled web server listening on port 80')
})

module.exports = app
