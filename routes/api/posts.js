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

// load Comment validation
const validateCommentInput = require('../../validation/comment')

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

// @route    GET request to api/posts
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
        .catch(err => res.status(404).json({ post: 'Post not found' }))
    })
  }
)

// @route    POST request to api/posts/like/:id
// @desc     Like a post
// @access   Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check if user already liked the post
          // if id of user who liked post is the same as logged in user
          // if length > 0, that means user has already liked it, like is already in array
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.status(400).json({ alreadyliked: 'Post already liked' })
          }

          // add user id to likes array
          post.likes.unshift({ user: req.user.id })

          // save
          post.save().then(post => {
            res.json(post)
          })
        })
        .catch(err => res.status.json({ post: 'Post already liked' }))
    })
  }
)

// @route    DELETE request to api/posts/unlike/:id
// @desc     Delete like/dislike
// @access   Private
router.delete(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check if user alreay liked the post
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this post' })
          }

          // remove like
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id)

          // splice from array
          post.likes.splice(removeIndex, 1)

          // save
          post.save().then(post => {
            res.json(post)
          })
        })
        .catch(err =>
          res.status(400).json({ notliked: 'You have not yet liked this post' })
        )
    })
  }
)

// @route    POST request to api/posts/comments/:id
// @desc     Add comment to post
// @access   Private
router.post(
  '/comments/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // validate comment input
    const { errors, isValid } = validateCommentInput(req.body)
    // Check validation
    if (!isValid) {
      // if any errors send 400 with error object
      return res.status(400).json(errors)
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        }

        post.comments.unshift(newComment)
        post.save().then(post => {
          res.json(post)
        })
      })
      .catch(err => res.status(404).json({ nopostfound: 'No post found' }))
  }
)

// @route    DELETE request to api/posts/comments/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete(
  '/comments/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check if comment exists, if there is no comment return error
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({ notfoundcomment: 'Comment not found' })
        }

        // else remove comment
        // get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id)
        // splice
        post.comments.splice(removeIndex, 1)

        // save
        post.save().then(post => {
          res.json(post)
        })
      })
      .catch(err =>
        res.status(404).json({ nocommentfound: 'Comment not found' })
      )
  }
)

module.exports = router
