const express = require('express')
const router = express.Router()


//@route    GET request to api/profile/test
//@desc     Testing the profile route
//@access   Public route
router.get('/test', (req, res) => res.json({ msg: 'profile works' })) // res.json will serve json from api

module.exports = router
