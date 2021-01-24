/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-23 22:35:02
 * @LastEditTime: 2021-01-24 00:30:21
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
const got = require('got');

const instance = got.extend({
	hooks: {
		beforeRequest: [
			options => {
				// if (!options.context || !options.context.token) {
				// 	throw new Error('Token required');
				// }
                console.log('options', options)
				// options.headers.token = options.context.token;
			}
		]
	}
});

instance.stream('http://www.google.com')
    .on('response', req => console.log('response', req))
    .on('error', (error, body, response) => {
        console.log('error', error)
    });