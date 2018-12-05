const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// post model
const Post = require('../../models/Post')
// profile model
const Profile = require('../../models/Profile')

// load Post validation
const validatePostInput = require('../../validation/post')

// @route    GET request to api/posts/test
// @desc     Testing the posts route
// @access   Public route
router.get('/test', (req, res) => res.json({ msg: 'posts works' })) // res.json will serve json from api

// @route    POST request to api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)
    // Check validation
    if (!isValid) {
      // if any errors send 400 with error object
      return res.status(400).json(errors)
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    })

    newPost.save().then(post => res.json(post))
  }
)

// @route    GEt request to api/posts
// @desc     Get all posts
// @access   Private
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts)
    })
    .catch(err => res.status(404).json({ posts: 'No posts found' }))
})

// @route    GEt request to api/posts/:id
// @desc     Get single post
// @access   Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      res.json(post)
    })
    .catch(err => res.status(404).json({ post: 'Post not found' }))
})

// @route    DELETE request to api/posts/:id
// @desc     Delete 1 post
// @access   Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check for post owner
          if (post.user.toString() !== req.user.id) {
            res.status(401).json({ notauthorized: 'User not authorized' })
          }
          // delete post
          post.remove().then(() => res.json({ success: true }))
        })
        .catch(err => res.status.json({ post: 'Post not found' }))
    })
  }
)

module.exports = router
