const User = require('../../model/User')

const sendRule = require('../../modules/send-rule')

/**
 * @description 유저를 생성합니다.
 *
 * @param {*} req Express req
 * @param {*} res Express res
 */
module.exports.createUser = function (req, res, next) {
    var requestData = User.filterData(req.body)
    if (User.isRequiredFieldsAble(requestData)) {
        User.getUserById(requestData[User.requiredFields()[0]]).then(() => {
            next(sendRule.createError(403, "이미 계정이 존재함"))
        })
            .catch(err => {
                if (err) next(err)
                var newUser = new User(requestData)
                newUser.save(err => {
                    if (err) next(err)
                    sendRule.sendCreated(res, null, "계정 생성")
                })
            })
    } else {
        next(sendRule.createError(400, "잘못된 요청"))
    }
}

/**
 * @description 유저 정보를 가져옵니다.
 *
 * @param {*} req Express req
 * @param {*} res Express res
 */
module.exports.getUserProfile = function (req, res, next) {
    res.setHeader('Authorization', User.createToken(req.user))
    sendRule.sendOK(res, req.user)
}

/**
 * @description 로그인 후 토큰을 가져옵니다
 *
 * @param {*} req Express req
 * @param {*} res Express res
 */
module.exports.login = function (req, res, next) {
    var id = req.body[User.requiredFields()[0]]
    var password = req.body[User.requiredFields()[1]]
    User.loginValidation(id, password,
        (data, token) => {
            sendRule.sendOK(res, token, "로그인 성공")
        },
        err => {
            next(err)
        })
}
/**
 * @description 비밀번호를 변경합니다.
 *
 * @param {*} req Express req
 * @param {*} res Express res
 */
module.exports.changePassword = function (req, res, next) {
    
}
/**
 * @description 계정을 삭제합니다.
 *
 * @param {*} req Express req
 * @param {*} res Express res
 */
module.exports.removeUser = function (req, res, next) {
    
}