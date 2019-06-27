const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const logger = require('./logger')
const sendRule = require('./send-rule')

var option = {
    //jwtFromRequest: ExtractJwt.fromBodyField('token'), // Body {token:'TOKEN_STRING'}
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Header {key : 'Authorization', value : 'Bearer TOKEN_STRING'}
    secretOrKey: process.env.DB_SECRET || "STAC", // Secret Key
    //issuer : '',
    //audience : ''
}

module.exports = () => {
    passport.use(new JwtStrategy(option, (jwt_payload, done) => {
        console.log(jwt_payload)
        // TODO: 로그인 부분 처리해야함.
    }))
    return {
        initialize() { // 기본
            return passport.initialize()
        },
        authenticate() { // 로그인 시도
            return passport.authenticate('jwt', {
                failWithError: true,
                session: false
            })
        },
    }
}