/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-21 23:56:43
 * @LastEditTime: 2021-01-24 03:07:15
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
import * as winston from 'winston'
import 'winston-daily-rotate-file';

// 错误信息日志
const ERROR_LOG_NAME = './logs/error.log';

// 所有运行日志
const APP_LOG_NAME = './logs/app-%DATE%.log'
// 保存天数
const SAVE_DAYS = '14d'

// 日志级别
const levels = (() => {
    if (process.env.debug = "1") {
        return ({
            error: 0,
            warn: 1,
            info: 2,
            verbose: 3,
            debug: 4,
            silly: 5
        })
    }
    return ({})
})()
console.log(typeof process.env.debug)
console.log(!!process.env.debug)
console.log(levels)
// 格式化输出内容
const formatter = winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => {
        // 输出格式
        // TODO message字段是Symbol对象，对于error级的日志，需要遍历message的Symbol拿到error对象
        const showInfo = `[${info.level}] ${info.timestamp}: ${info.message}` ;
        return showInfo
    })
)

const logger = winston.createLogger({
    levels: levels,
    format: formatter,
    transports: [
        // 'error'级别的日志处理
        new winston.transports.File({
            level: 'error',
            filename: ERROR_LOG_NAME
        }),
        new (winston.transports.DailyRotateFile)({
            filename: APP_LOG_NAME,
            zippedArchive: true,
            maxFiles: SAVE_DAYS
        }),
        // 控制台输出
        new winston.transports.Console({})
    ]
});


export default logger;
