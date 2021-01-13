/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-13 21:57:14
 * @LastEditTime: 2021-01-14 01:01:28
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
import { createConnection, createPool, Pool, Connection, ConnectionConfig, PoolConfig } from 'mysql'
import mysql_config from './mysql.config'

class Mysql {

    // 数据连接
    private coon: Connection | Pool

    constructor(mysql_config: ConnectionConfig | PoolConfig, isPool: boolean) {
        this.coon = isPool ? createPool(mysql_config) : createConnection(mysql_config)
    }

    /**
     * 执行sql
     * @param sql sql语句
     * @param values sql参数
     */
    async execute(sql: string, values?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.coon.query(sql, values, (err, rows, fields) => {
                if (err) {
                    reject(err)
                }
                resolve(rows)
            })
        })
    }

    /**
     * 关闭数据连接
     */
    close(): void {
        this.coon.end()
    }

}
console.log(process.env.isPool)
console.log(!!process.env?.isPool)
export default new Mysql(mysql_config, !!process.env?.isPool)


