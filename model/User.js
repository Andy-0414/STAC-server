const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jwt-simple')

var UserSchema = new Schema({
    username: String, // 유저 이름
    email: String, // 이메일
    password: String, // 패스워드
    registerTime: { // 가입 시간
        type: Date,
        default: Date.now
    },
    lastLogin: { // 최근 로그인 시간
        type: Date,
        default: Date.now
    },
    isAdmin: Boolean // 어드민 권한
})
// 정적 메서드
/**
 * @description 아이디로 유저를 찾습니다.
 * @param {*} id 유저 아이디
 */
UserSchema.statics.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        this.findOne({id: id}, (err, data) => {
            if (err) reject(err)
            if (!data) reject(null)
            resolve(data)
        })
    })
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
            else resolve(true)
        })
    })
}
UserSchema.methods.getToken = function(){
    return "Bearer " + jwt.encode(data, process.env.DB_SECRET || "STAC")
}
module.exports = mongoose.model('User', UserSchema);