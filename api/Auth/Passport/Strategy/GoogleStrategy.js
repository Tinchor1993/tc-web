let passport = require('passport')
let googleStrategy = require('passport-google-oauth').OAuth2Strategy
const config = require('../../../../config.json')
const isProduction = process.env.NODE_ENV === 'dev'
const callbackUrl = isProduction
  ? `${config.redirectURL.development}`
  : `${config.redirectURL.production}`

module.exports = function() {
  passport.use(
    new googleStrategy(
      {
        clientID: `${config.googlePassport.clientId}`,
        clientSecret: `${config.googlePassport.clientSecret}`,
        callbackURL: callbackUrl,
        passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
        let user = {}

        user.id = profile.id
        user.displayName = profile.displayName

        user.google = {}
        user.google.id = profile.id
        user.google.token = accessToken
        user.email = profile.emails[0].value

        done(null, user)
      }
    )
  )
}
