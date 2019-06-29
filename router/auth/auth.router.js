const router = require('express').Router()

const passportJwtAuth = require('../../modules/passport-jwt-auth')()

const auth = require('./auth.controllter')

// 로그인이 필요 없는 작업 또는 로그인 작업
router.post('/createUser', auth.createUser)
router.post('/login', auth.login)

// 로그인이 필요한 작업
router.post('/getUserProfile', passportJwtAuth.authenticate(), auth.getUserProfile)

module.exports = router
