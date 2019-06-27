const chalk = require('chalk')
const moment = require('moment')
const l = console.log

require('moment-timezone');
moment.tz.setDefault('Asia/Seoul') // 한국/서울 기준

module.exports = {
    /**
     * @description 현재 시간을 구합니다.
     * @returns 현재 시간 문자열
     */
    getNowTime() { // 현재 시간
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    },
    _defaultLogFormat(type, args) { // 기본 포멧
        args.forEach(x => {
            l(chalk.bold.yellow(`[${this.getNowTime()}]${type} `) + chalk.white(x))
        })
    },
    /**
     * @description 기본적인 로그를 보냅니다. (노란색)
     *
     * @param {String} args
     */
    log(...args) { // 일반 로그
        this._defaultLogFormat(chalk.bold.yellow("[LOG]"), args)
    },
    /**
    * @description 성공한 로그를 보냅니다. (초록색)
    *
    * @param {String} args
    */
    logc(...args) { // 성공 로그
        this._defaultLogFormat(chalk.bold.green("[CLEAR]"), args)
    },
    /**
    * @description 실패한 로그를 보냅니다. (빨간색)
    *
    * @param {String} args
    */
    loge(...args) { // 에러 로그
        this._defaultLogFormat(chalk.bold.red("[ERROR]"), args)
    }
}