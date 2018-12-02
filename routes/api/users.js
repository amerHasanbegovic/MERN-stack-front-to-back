const express = require('express')
const router = express.Router()


//@route    GET request to api/users/test
//@desc     Testing the users route
//@access   Private route
router.get('/test', (req, res) => res.json({ msg: 'users works' })) // res.json will serve json from api

module.exports = router
