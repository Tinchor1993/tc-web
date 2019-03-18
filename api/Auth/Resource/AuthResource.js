const express = require('express')
const passport = require('passport')
const sha1 = require('sha1')
const router = express.Router()
import AuthDAO from '../DAO/AuthDAO'
let redirectURL
const LocalStrategy = require('passport-local').Strategy
require('../Passport/Strategy/GoogleStrategy')

router.get('/', (req, res, next) => {
  redirectURL = req.headers.referer
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })(req, res, next)
})

router.get('/callback', (req, res, next) => {
  passport.authenticate('google', { failWithError: true }, function(
    err,
    user,
    info
  ) {
    if (err) {
      return res.status(403).send({ message: err.message })
    }
    if (!user) {
      return res.status(403).send({ message: 'System Error' })
    }
    AuthDAO.isInvited(user.email).then(data => {
      if (data.bool === true) {
        AuthDAO.updateGoogleId(data.id, data.creationDate, user.id).then(() => {
          req.logIn(user, err => {
            if (err) {
              return res.send({
                success: false,
                message: err
              })
            }
            redirectURL = redirectURL.replace('no-access', '')
            redirectURL = redirectURL + 'token?user=' + JSON.stringify(user)
            console.log(redirectURL)
            return res.redirect(redirectURL)
          })
        })
      } else {
        res.send({
          error: 'Authorization error',
          message: 'Please, activate your account'
        })
      }
    })
  })(req, res, next)
})

router.get('/redirect', function(req, res) {
  res.send('ok')
})

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password'
    },
    function(username, password, done) {
      AuthDAO.singIn(username, sha1(password)).then(function(err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false)
        }
        return done(null, user)
      })
    }
  )
)

/**
 * Adm auth
 */
router.post('/admin', (req, res, next) => {
  passport.authenticate('local', { failWithError: true }, function(
    user,
    err,
    info
  ) {
    if (err) {
      return res.status(403).send({ message: err.message })
    }
    if (!user) {
      return res.status(403).send({ message: 'System Error' })
    }

    req.logIn(user, err => {
      if (err) {
        return res.send({
          success: false,
          message: 'Request login failure'
        })
      }
      const userFinal = user.Items[0]
      delete userFinal.password
      return res.send({
        success: true,
        userFinal
      })
    })
  })(req, res, next)
})
/**
 * Error Handle
 */
router.get('*', function(req, res) {
  res.sendStatus(404)
})
router.post('*', function(req, res) {
  res.sendStatus(404)
})
router.put('*', function(req, res) {
  res.sendStatus(404)
})
router.delete('*', function(req, res) {
  res.sendStatus(404)
})

module.exports = router
