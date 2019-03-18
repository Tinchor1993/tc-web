let passport = require('passport')
const bodyParser = require('body-parser')

module.exports = function(app) {
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  require('./Strategy/GoogleStrategy')()
}
