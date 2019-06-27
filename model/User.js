var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
    
/**
 * @description 아이디로 유저를 찾습니다.
 * @param {*} id 유저 아이디
 * @param {*} callback (err,data)=>{}
 */
UserSchema.statics.findUserById = function (id, callback) {
    return this.find({ id: id }, callback)
}
module.exports = mongoose.model('User', UserSchema);