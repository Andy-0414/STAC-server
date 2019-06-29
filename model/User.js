const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jwt-simple')

var obj = {
    id: String, // 아이디
    email: String, // 이메일
    password: String, // 패스워드
    nickname: String,
    registerTime: { // 가입 시간
        type: Date,
        default: Date.now
    },
    lastLogin: { // 최근 로그인 시간
        type: Date,
        default: Date.now
    },
    isAdmin: Boolean // 어드민 권한
}
var UserSchema = new Schema(obj)

// 정적 메서드
UserSchema.statics.requiredFields = function () {
    return ["id", "password"] // 아이디 비밀번호 기본값
}
UserSchema.statics.isRequiredFieldsAble = function (obj) {
    return obj[this.requiredFields()[0]] && obj[this.requiredFields()[1]]
}
UserSchema.statics.getUserStatusList = function () {
    return Object.keys(obj)
}
UserSchema.statics.filterData = function (data) {
    var obj = {}
    this.getUserStatusList().forEach(x => {
        if (data[x])
            obj[x] = data[x]
    })
    return obj
}
UserSchema.statics.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        this.findOne({
            id: id
        }, (err, data) => {
            if (err) reject(err)
            if (!data) reject(null)
            resolve(data)
        })
    })
}
UserSchema.statics.loginValidation = function (id, password, callbackTrue, callbackFalse) {
    this.getUserById(id)
        .then(user => {
            if (user.checkPassword(password)) {
                user.updateLastLogin()
                    .then(() => {
                        callbackTrue(user, user.getToken())
                    })
                    .catch(err => {
                        callbackFalse(err)
                    })
            } else {
                callbackFalse(sendRule.createError(404, "비밀번호가 일치하지 않음"))
            }
        })
        .catch(err => {
            if (err) callbackFalse(err)
            else callbackFalse(sendRule.createError(400), "계정이 존재하지 않음")
        })
}
UserSchema.statics.createToken = function(data){
    return "Bearer " + jwt.encode(data, process.env.DB_SECRET || "STAC")
}
// 메서드
UserSchema.methods.checkPassword = function (pw) {
    return this.password == pw
}
UserSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date()
    return new Promise((resolve, reject) => {
        this.save(err => {
            if (err) reject(err)
            else resolve(this)
        })
    })
}
UserSchema.methods.getToken = function () {
    return "Bearer " + jwt.encode(this, process.env.DB_SECRET || "STAC")
}
module.exports = mongoose.model('User', UserSchema);