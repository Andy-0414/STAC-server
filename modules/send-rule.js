const logger = require('./logger')

module.exports = {
    _defaultSendFormat(res, data, msg, status, result = true) { // 기본 포멧
        if (status >= 400) logger.loge(msg)
        else logger.logc(msg)
        res.status(status).send({
            result,
            msg,
            data
        }).end()
    },
    /**
     * @description 성공 전송
     * @param {Object} res Express res 객체
     * @param {Object} data 객체 데이터
     * @param {String} [msg="200 OK"] 메세지
     */
    sendOK(res, data, msg = "200 OK") { // 성공
        this._defaultSendFormat(res, data, msg, 200)
    },
    /**
     * @description 생성 전송
     * @param {Object} res
     * @param {Object} data
     * @param {string} [msg="201 Created"]
     */
    sendCreated(res, data, msg = "201 Created") { // 생성
        this._defaultSendFormat(res, data, msg, 201)
    },
    /**
     * @description 성공 전송
     * @param {Object} res Express res 객체
     * @param {Object} data 객체 데이터
     * @param {string} [msg="202 Accepted"]
     */
    sendAccepted(res, data, msg = "202 Accepted") { // 수락
        this._defaultSendFormat(res, data, msg, 202)
    },
    /**
     * @description 잘못된 요청 전송
     * @param {Object} res Express res 객체
     * @param {Object} data 객체 데이터
     * @param {string} [msg="400 BadRequest"]
     */
    sendBadRequest(res, data, msg = "400 BadRequest") { // 잘못된 요청
        this._defaultSendFormat(res, data, msg, 400, false)
    },
    /**
     * @description 인증 필요 전송
     * @param {Object} res Express res 객체
     * @param {Object} data 객체 데이터
     * @param {string} [msg="401 Unauthorized"]
     */
    sendUnauthorized(res, data, msg = "401 Unauthorized") { // 인증 필요
        this._defaultSendFormat(res, data, msg, 401, false)
    },
    /**
     * @description 숨김 전송
     * @param {Object} res Express res 객체
     * @param {Object} data 객체 데이터
     * @param {string} [msg="403 Forbidden"]
     */
    sendForbidden(res, data, msg = "403 Forbidden") { // 숨김
        this._defaultSendFormat(res, data, msg, 403, false)
    },
    /**
     * @description 찾을 수 없음 전송
     * @param {Object} res Express res 객체
     * @param {Object} data 객체 데이터
     * @param {string} [msg="404 NotFound"]
     */
    sendNotFound(res, data, msg = "404 NotFound") { // 찾을 수 없음
        this._defaultSendFormat(res, data, msg, 404, false)
    },
    /**
     * @description 서버 에러 전송
     * @param {*} res Express res 객체
     * @param {*} data 객체 데이터
     * @param {string} [msg="500 InternalServerError"] 메세지
     */
    sendInternalServerError(res, data, msg = "500 InternalServerError") { // 서버 에러
        this._defaultSendFormat(res, data, msg, 500, false)
    },
    /**
     * @description 에러를 생성합니다.
     *
     * @param {number} [status=500] 응답 코드
     * @param {string} message 에러 메세지
     * @returns {Error} err
     */
    createError(status = 500, message) { // 에러 생성
        var err = new Error(message)
        err.status = status
        return err
    },
    /**
     * @description 에러 핸들링
     * @returns Express 에러 핸들러
     */
    errorHendling() { // 에러 핸들링
        return (err, req, res, next) => {
            switch (err.status) {
                case 400:
                    this.sendBadRequest(res, null, err.message)
                    break
                case 401:
                    this.sendUnauthorized(res, null, err.message)
                    break
                case 404:
                    this.sendNotFound(res, null, err.message)
                    break
                case 500:
                    this.sendInternalServerError(res, null, err.message)
                    break
                default:
                    this.sendInternalServerError(res, null, err.message)
            }
        }
    }
}