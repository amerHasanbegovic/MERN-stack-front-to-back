const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
// const keys = require("../../config/keys")

// load profile and user model
const Profile = require('../../models/Profile')
const User = require('../../models/User')
// load validation for profile
const validateProfileInput = require('../../validation/profile')
// load validation for profile experience
const validateExperienceInput = require('../../validation/experience')
// load validation for education
const validateEducationInput = require('../../validation/education')

// @route    GET request to api/profile/test
// @desc     Testing the profile route
// @access   Public route
router.get('/test', (req, res) => res.json({ msg: 'profile works' })) // res.json will serve json from api

// @route    GET request to api/profile
// @desc     Get current users profile
// @access   Private

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {}

    Profile.findOne({ user: req.user.id }) // user that is logged in
      .populate('user', ['name', 'avatar']) // get data about user, name and avatar, profile and user are connected
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user'
          return res.status(404).json(errors)
        }
        res.json(profile)
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route    GET api/profile/all
// @desc     Get all profiles
// @access   Public

router.get('/all', (req, res) => {
  const errors = {}

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = 'There are no profiles'
        return res.status(404).json(errors)
      }
      res.json(profiles)
    })
    .catch(err => res.status(404).json({ profiles: 'There are no profiles' }))
})

// @route    GET api/profile/handle/:handle
// @desc     Backend, get profile by handle
// @access   Public
router.get('/handle/:handle', (req, res) => {
  const errors = {}
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user'
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @route    GET api/profile/user/:user_id
// @desc     Backend, get profile by user id
// @access   Public
router.get('/user/:user_id', (req, res) => {
  const errors = {}

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for that user id'
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for that user id' })
    )
})

// @route    POST request to api/profile
// @desc     Create or edit user profile
// @access   Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body)
    // check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    // get profile fields, company, education...
    const profileFields = {}
    profileFields.user = req.user.id // logged in user
    if (req.body.handle) profileFields.handle = req.body.handle
    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.status) profileFields.status = req.body.status
    if (req.body.bio) profileFields.bio = req.body.bio
    if (req.body.githubusername) {
      profileFields.comgithubusernamepany = req.body.githubusername
    }
    // skills - split into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',')
    }
    // social
    profileFields.social = {}
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // if there is a profile that means update not create new one
        // update: find user by id, set new values
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile))
      } else {
        // Create profile if there is no one
        // check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle already exists'
            res.status(400).json(erorrs)
          }
          // save profile instead
          new Profile(profileFields).save().then(profile => res.json(profile))
        })
      }
    })
  }
)

// @route    POST request to api/profile/experience
// @desc     add experience to profile
// @access   Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body)
    // check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      // Need to add to experience array in profile
      profile.experience.unshift(newExp)
      profile.save().then(profile => res.json(profile))
    })
  }
)

// @route    POST request to api/profile/education
// @desc     add education to profile
// @access   Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body)
    // check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }

      // Need to add to education array in profile
      profile.education.unshift(newEdu)
      profile.save().then(profile => res.json(profile))
    })
  }
)

// @route    DELETE request to api/profile/experience/:exp_id
// @desc     delete experience from profile
// @access   Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // find experience to delete, get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id)

        // splice out of array
        profile.experience.splice(removeIndex, 1)

        // save and send it back
        profile.save().then(profile => res.json(profile))
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route    DELETE request to api/profile/education/:edu_id
// @desc     delete education from profile
// @access   Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // find education to delete, get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id)

        // splice out of array
        profile.education.splice(removeIndex, 1)

        // save and send it back
        profile.save().then(profile => res.json(profile))
      })
      .catch(err => res.status(404).json(err))
  }
)

// @route    DELETE request to api/profile
// @desc     delete profile and user
// @access   Private

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true })
      })
    })
  }
)

module.exports = router

// ADD METHOD TO UPDATE EDUCATION OR EXPERIENCE
