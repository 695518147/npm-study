/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-13 23:27:45
 * @LastEditTime: 2021-01-14 00:46:25
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
import { ConnectionConfig, PoolConfig } from 'mysql'

const devConfig: ConnectionConfig | PoolConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'test'
}

const prodConfig: ConnectionConfig | PoolConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'test'
}

export default process.env.NODE_ENV === 'dev' ? devConfig : prodConfig