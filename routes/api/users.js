const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

//load input validation
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")


// @route    GET request to api/users/test
// @desc     Testing the users route
// @access   Private
router.get('/test', (req, res) => res.json({ msg: 'users works' })) // res.json will serve json from api

// @route    GET request to api/users/register
// @desc     User registration
// @access   Public

// loading user model
const User = require('../../models/User')

router.post('/register', (req, res) => {
  //"pull" out errors, and isValid
  //check if input is empty or undefined or..
  const { errors, isValid } = validateRegisterInput(req.body)
  //check validation
  if(!isValid){
    return res.status(400).json(errors)
  }


  // if email already exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists'
      return res.status(400).json(errors)
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // size
        rating: 'pg', // rating
        d: 'mm' // default
      })
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      })

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err
          } else {
            newUser.password = hash
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          }
        })
      })
    }
  })
})

// @route    GET request to api/users/login
// @desc     User login / Returning token
// @access   Public

// key from keys.js
const keys = require('../../config/keys')
router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body)
  //check validation
  if(!isValid){
    return res.status(400).json(errors)
  }

  const email = req.body.email
  const password = req.body.password

  // finding user by email
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      errors.email = 'User not found'
      return res.status(404).json(errors)
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched

        const info = { id: user.id, name: user.name, avatar: user.avatar } // create jwt info

        // Sign token
        jwt.sign(info, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          })
        })
      } else {
        errors.password = 'Password incorrect'
        return res.status(400).json(errors)
      }
    })
  })
})

// @route    GET request to api/users/current
// @desc     Returns current user
// @access   Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // res.json({ msg: 'Success' })
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    })
  }
)

module.exports = router
