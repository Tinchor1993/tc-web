import app from "../index";
import session from "express-session";

const passport = require('passport')
const bodyParser = require('body-parser')


module.exports = function(app) {
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.set('trust proxy', 1) 
  app.use(session({
    secret: 'thinking'
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    console.dir('serializeUser', user)
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    console.dir('deserializeUser', user)
    done(null, user)
  })

  require('./Strategy/GoogleStrategy')()
}
