const mongoose = require('mongoose');
const _db = mongoose.connection;

const logger = require('./logger')

_db.on('error', () => { // 몽고DB 에러 이벤트 핸들링
    logger.loge("Mongo connect error")
});
_db.once('open', () => { // 몽고DB 연결 이벤트 핸들링
    logger.logc("Mongo connect success")
});
mongoose.connect(process.env.DB_URL || "mongodb://localhost/STAC", {
    useNewUrlParser: true
}); // DB 연결 시도

module.exports = {
    getDB() {
        return _db
    }
}