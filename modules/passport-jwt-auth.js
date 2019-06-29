const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require('../model/User')

var option = {
    //jwtFromRequest: ExtractJwt.fromBodyField('token'), // Body {token:'TOKEN_STRING'}
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Header {key : 'Authorization', value : 'Bearer TOKEN_STRING'}
    secretOrKey: process.env.DB_SECRET || "STAC", // Secret Key
    //issuer : '',
    //audience : ''
}

module.exports = () => {
    passport.use(new JwtStrategy(option, (jwt_payload, done) => {
        var id = jwt_payload[User.requiredFields()[0]]
        var password = jwt_payload[User.requiredFields()[1]]
        User.loginValidation(id, password,
            data => {
                done(null, data)
            },
            err => {
                done(err)
            })
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