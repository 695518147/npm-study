/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-21 23:49:03
 * @LastEditTime: 2021-01-23 22:22:42
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
process.env.debug = "1"

import * as request from 'request'
import log from '../log/log'

class RequestConfig {
    method?: string
    preambleCRLF?: boolean
    uri?: string
    body?: any
    form?: any
    formData?: any
    multipart?: typeof Array | object
    headers?: object
    debug?: boolean

}

class Body {
    body: any
}

class Form {
    form: any
}

class FormData {
    formData: any
}


class Request {
    static zInitParam(url: string | RequestConfig, config?: RequestConfig): RequestConfig {
        // 直接传url的情况
        if (typeof url === 'string') {
            if (typeof config === 'undefined') {
                config = new RequestConfig()
            }

            if ((url as string).startsWith('http')) {
                config.uri = url as string
                return config
            }

            config.uri = config.uri + (url as string)
            return config
        }

        return config
    }

    static zRequest(url: string | RequestConfig, config?: RequestConfig): Promise<any> {

        return new Promise((resolve, reject) => {
            request(Request.zInitParam(url, config), (error, response, body) => {
                if (error) {
                    reject(error)
                    return
                }

                if (response.statusCode === 200) {
                    resolve(body)
                } else {
                    reject(response)
                }

            })
        })
    }

    static zGet(url: string, data?: object, headers?: any): Promise<any> {
        let rc: RequestConfig = new RequestConfig()
        rc.method = 'get'
        if (typeof headers === 'undefined') {
            rc.headers = headers
        }
        
        return Request.zRequest(url, rc)
    }

    static zPost(url: string, data: Form | FormData | Body): Promise<any> {
        let rc: RequestConfig = new RequestConfig()
        
        if (data instanceof Form) {
            rc.form = data.form
        } else if (data instanceof FormData) {
            rc.formData = data.formData
        } else if (data instanceof Body) {
            rc.body = data.body
        } else {
            throw new Error(`data is invalid, data=${data}`)
        }

        rc.method = 'post'
        return Request.zRequest(url, rc)
    }


}

Request.zRequest('http://www.baidu.com').then((res) => {
    console.log('res:', "res"); // Print the HTML for the Google homepage.
}).catch((err: Error) => {
    console.log(err.message)
})