import { RequestParam } from '../config';
/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-24 01:35:11
 * @LastEditTime: 2021-01-24 19:17:58
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
import got from 'got'
import * as tunnel from 'tunnel'
import cookie from 'cookie'
import * as formData from 'form-data'
import * as crypto from 'crypto'
import * as oAuth from 'oauth-1.0a'

export const request = (options: any) => {
    return got(options)
}
