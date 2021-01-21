/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-21 23:49:03
 * @LastEditTime: 2021-01-22 00:53:48
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
process.env.debug = "1"

import * as request from 'request'
import log from '../log/log'

log.error("process.env.debug " + process.env.debug )