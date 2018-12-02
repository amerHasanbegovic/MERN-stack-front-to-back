const express = require('express')
const router = express.Router()


//@route    GET request to api/posts/test
//@desc     Testing the posts route
//@access   Public route
router.get('/test', (req, res) => res.json({ msg: 'posts works' })) // res.json will serve json from api

module.exports = router
