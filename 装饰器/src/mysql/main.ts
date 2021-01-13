/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-13 23:49:54
 * @LastEditTime: 2021-01-14 01:02:34
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
process.env.isPool = '';
import coon from './pool.mysql'


coon.execute('select * from user').then(rows => {
    console.log(rows)
}).then(err => {
    console.log(err)
}).finally(() => {
    coon.close()
})
