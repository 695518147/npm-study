"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-13 23:49:54
 * @LastEditTime: 2021-01-14 00:30:20
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
var mysql_config_1 = __importDefault(require("./mysql.config"));
var pool_mysql_1 = __importDefault(require("./pool.mysql"));
var mysql = new pool_mysql_1.default(mysql_config_1.default);
mysql.execute('select * from user').then(function (rows) {
    console.log(rows);
}).then(function (err) {
    console.log(err);
}).finally(function () {
    mysql.close();
});
