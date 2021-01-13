"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var devConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'test'
};
var prodConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot',
    database: 'test'
};
exports.default = process.env.NODE_ENV === 'dev' ? devConfig : prodConfig;
