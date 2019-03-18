import { Router } from "express"
import userModel from "../models/users"
import studentModel from "../models/students"
import sha1 from "sha1"

const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
let redirectURL
export default ({ config, db }) => {
  const router = Router()
  const users = userModel({ config, db })
  const students = studentModel({ config, db })

  router.get("/", (req, res, next) => {
    redirectURL = req.headers.referer
    passport.authenticate("google", { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] })(req, res, next)
  })


  router.get("/callback", (req, res, next) => {
    passport.authenticate("google", { failureRedirect:'/dashboard/login' }, 
    function (
      err,
      user
    ) {
      if (err) {
        console.log("google auth")
        return res.status(403).send({ message: err.message })
      }
      if (!user) {
        return res.status(403).send({ message: "System Error" })
      }

      users
        .isInvited(user.email)
        .then(data => {
          if (data.bool === true) {
            return users
              .updateStudentGoogleId(data.id, data.creationDate, user.id)
              .then(() => {
                req.logIn(user, err => {
                  if (err) {
                    console.error(err)
                    return res.send({
                      success: false,
                      passportError: true,
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
              error: "Authorization error",
              message: "You are not invited in this lesson"
            })

          }
        })
        .catch(err => {
          return res.send(err)
        })
    })(req, res, next)
  })

  router.get("/redirect", function (req, res) {
    res.send("ok")
  })

  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "login",
        passwordField: "password"
      },
      (username, password, done) => {
        users
          .loginUser(username, sha1(password))
          .then(user => {
            if (!user) {
              return done(null, false)
            }

            return done(null, user)
          })
          .catch(err => {
            return done(err, false)
          })
      }
    )
  )

  router.post("/admin", (req, res, next) => {
    passport.authenticate("local", { failWithError: true }, function (
      err,
      user
    ) {
      if (err) {
        return res.status(403).send({ message: err.message })
      }
      if (!user) {
        return res.status(403).send({ message: "System Error" })
      }

      req.logIn(user, err => {
        if (err) {
          return res.send({
            success: false,
            message: "Request login failure"
          })
        }

        const userFinal = {
          ...user
        }

        delete userFinal.password

        return res.send({
          success: true,
          userFinal
        })
      })
    })(req, res, next)
  })

  return router
}
