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
UserSchema.statics.requiredFields = function () { // 아이디 패스워드 키값
    return ["id", "password"] // 아이디 비밀번호 기본값
}
UserSchema.statics.isRequiredFieldsAble = function (obj) { // 아이디 패스워드 유효성 검사
    return obj[this.requiredFields()[0]] && obj[this.requiredFields()[1]]
}
UserSchema.statics.getUserStatusList = function () { // User 스키마에 대한 키값 반환
    return Object.keys(obj)
}
UserSchema.statics.filterData = function (data) { // user 스키마에 맞는 데이터만 추출
    var obj = {}
    this.getUserStatusList().forEach(x => {
        if (data[x])
            obj[x] = data[x]
    })
    return obj
}
UserSchema.statics.getUserById = function (id) { // User ID로 User 검색
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
UserSchema.statics.loginValidation = function (id, password, callbackTrue, callbackFalse) { // id,password 입력으로 로그인 후 참,거짓 콜백 반환
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
UserSchema.statics.createToken = function(data){ // 토큰 생성
    return "Bearer " + jwt.encode(data, process.env.DB_SECRET || "STAC")
}
// 메서드
UserSchema.methods.checkPassword = function (pw) { // 패스워드 유효성 검사
    return this.password == pw
}
UserSchema.methods.updateLastLogin = function () { // 마지막으로 로그인 한 날짜 갱신
    this.lastLogin = new Date()
    return new Promise((resolve, reject) => {
        this.save(err => {
            if (err) reject(err)
            else resolve(this)
        })
    })
}
UserSchema.methods.getToken = function () { // 이 유저에 대한 토큰 생성
    return "Bearer " + jwt.encode(this, process.env.DB_SECRET || "STAC")
}
module.exports = mongoose.model('User', UserSchema);