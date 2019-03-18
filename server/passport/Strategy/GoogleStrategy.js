let passport = require("passport")
let googleStrategy = require("passport-google-oauth").OAuth2Strategy
const config = require("../../../config.json")
const isProduction = process.env.NODE_ENV === "dev"
const callbackUrl = isProduction
  ? `${config.redirectURL.development}`
  : `${config.redirectURL.production}`

module.exports = function() {
  passport.use(
    new googleStrategy(
      {
        clientID: `${config.googlePassport.clientId}`,
        clientSecret: `${config.googlePassport.clientSecret}`,
        callbackURL: callbackUrl
      },
      function(accessToken, refreshToken, profile, done) {

        if (profile.emails[0]) {
          console.log("email is " + profile.emails[0].value)
          let user = {}

          user.id = profile.id
          user.displayName = profile.displayName
  
          user.google = {}
          user.google.id = profile.id
          user.google.token = accessToken
          user.email = profile.emails[0].value
          
          return done(null, user)
        }else {
          let noEmailError = new Error("Your email privacy settings prevent you from signing in.")
          return done(noEmailError, null)
        }
        
      }
    )
  )
}
