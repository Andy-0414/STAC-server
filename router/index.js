const router = require('express').Router()

const auth = require('./auth/auth.router')

router.use('/auth',auth)

module.exports = router