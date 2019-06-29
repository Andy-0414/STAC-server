const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const logger = require('./logger')
const sendRule = require('./send-rule')

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
        console.log(jwt_payload)
        User.getUserById(jwt_payload)
            .then(data => {
                if (data.checkPassword(jwt_payload.password)) {
                    data.updateLastLogin()
                        .then(() => {
                            done(null, data)
                        })
                        .catch(err => {
                            done(err)
                        })
                } else {
                    done(sendRule.createError(404, "비밀번호가 일치하지 않음"))
                }
            })
            .catch(err => {
                if (err) done(err)
                else done(sendRule.createError(404, "계정이 존재하지 않음"))
            })
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