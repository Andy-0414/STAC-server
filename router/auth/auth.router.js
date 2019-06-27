const router = require('express').Router()

const auth = require('./auth.controllter')

router.get('/createUser',auth.createUser)

module.exports = router
