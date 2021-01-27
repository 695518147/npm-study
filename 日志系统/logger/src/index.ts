/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-27 22:11:12
 * @LastEditTime: 2021-01-28 00:39:05
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
import * as log4js from 'log4js'
import * as path from 'path'

// 错误信息日志
const ERROR_LOG_NAME = './logs/error.log';

const FILE_LOG_NAME = './logs/root.log'
const DATA_FILE_LOG_NAME = './logs/dataFile'

log4js.configure({
    appenders: {
        fileout: {
            type: "file",
            filename: FILE_LOG_NAME,
            maxLogSize: 10000000,
            backups: 20,
            layout: {
                type: 'pattern',
                pattern: `[%d (${process.uptime()})] [%p] %c - %m`,
                tokens: { "pid": function () { return process.pid; } }
            }
        },
        datafileout: {
            type: "dateFile",
            maxLogSize: 10000000,
            backups: 50,
            layout: {
                type: 'pattern',
                pattern: `[%d (${process.uptime()})] [%p] %c - %m`,
                tokens: { "pid": function () { return process.pid; } }
            },
            filename: DATA_FILE_LOG_NAME,
            pattern: "yyyy-MM-dd-hh-mm-ss.log",
            alwaysIncludePattern: true, category: 'cheese'
        },
        consoleout: { type: "console" },
    },
    categories: {
        default: { appenders: ["fileout", "consoleout"], level: "debug" },
        [path.basename(process.mainModule.filename)]: { appenders: ["datafileout", "consoleout"], level: "debug" }
    }
});

export default log4js.getLogger(path.basename(process.mainModule.filename))
