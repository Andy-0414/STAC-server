/* TODO:
 * - MVC 패턴으로 만들기 (중요)
 * - 기본적인 로그인 구현하기
 * - 유저 모델 만들기
 * - 확장성 있게 제작하기
 * - JSDoc 이용하기
 */
require('dotenv').config()
const express = require('express');
const app = express();

const logger = require('./modules/logger')
const router = require('./router/index')
const sendRule = require('./modules/send-rule')
const passportJwt = require('./modules/passport-jwt-auth')
const mongo = require('./modules/mongo-connect').getDB()

app.listen(process.env.PORT || 80, () => {
    logger.logc("SERVER OPEN")
})

app.use(express.static('public'))
app.use(express.urlencoded());
app.use(express.json())

app.use(router)

// Error handling
app.use(sendRule.errorHendling()) // 400~500
app.use((req, res, next) => {
    sendRule.sendNotFound(res, null)
}) // Page Not Found