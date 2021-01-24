/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-24 00:43:44
 * @LastEditTime: 2021-01-24 19:55:27
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */

import { Config, TenPayUrl, RequestParam } from './config'
import * as util from './request/util'
import { request as zGot } from './request/request'
import log from './log/log'

class Payment {

    private config: Config

    /**
     * 普通商户支付
     * @param config 
     * @param debug 
     */
    constructor(config: Config) {
        if (!config.appId) throw new Error('appId fail');
        if (!config.mchId) throw new Error('mchId fail');
        config.urls = config.sandbox ? TenPayUrl.sandboxUrl : TenPayUrl.url
        this.config = config
    }

    static init(config: Config) {
        return new Payment(config);
    }

    static async sandbox(config: Config) {
        config.sandbox = true
        let pay = Payment.init(config)
        let { sandbox_signkey } = await pay.getSignkey();
        config.partnerKey = sandbox_signkey

        return new Payment(config);
    }

    private async parseBill(xml, format = false) {
        if (util.checkXML(xml)) {
            let json = await util.parseXML(xml);
            throw new Error(json.err_code || json.return_msg || 'XMLDataError');
        }
        if (!format) return xml;

        let arr = xml.trim().split(/\r?\n/).filter(item => item.trim());
        let total_data = arr.pop().substr(1).split(',`');
        let total_title = arr.pop().split(',');
        let list_title = arr.shift().split(',');
        let list_data = arr.map(item => item.substr(1).split(',`'));
        return { total_title, total_data, list_title, list_data };
    }

    // 获取沙盒密钥
    getSignkey() {
        let pkg = {
            mch_id: this.config.mchId,
            nonce_str: util.generate()
        };
        return this.request(pkg, 'getsignkey');
    }

    async request(params, type, cert = false) {
        // 安全签名
        params.sign = this.getSign(params, params.sign_type);
        log.debug(`request url is [${this.config.urls[type]}]`)
        // 创建请求参数
        let pkg: RequestParam = {
            url: this.config.urls[type],
            method: 'POST',
            dataType: 'text',
            body: util.buildXML(params),
            timeout: [10000, 15000]
        };

        if (cert) {
            pkg.pfx = this.config.pfx;
            pkg.passphrase = this.config.mchId;
        }
        const str = util.generate()
        log.info(`[${str}]post data =>
${pkg.body}
`, );
        let { statusCode, body } = await zGot(pkg);
        if (statusCode !== 200) throw new Error('request fail');
        log.info(`[${str}]receive data =>
${body}
`);

        return ['downloadbill', 'downloadfundflow'].indexOf(type) < 0 ? this.parse(body, type, params.sign_type) : body;
    }

    private async parse(xml, type, signType) {
        let json = await util.parseXML(xml);

        switch (type) {
            case 'middleware_nativePay':
                break;
            default:
                log.error(`receive data => ${JSON.stringify(json)}`)
                if (json.return_code !== 'SUCCESS') throw new Error(json.return_msg || 'XMLDataError');
        }

        switch (type) {
            case 'middleware_refund':
            case 'middleware_nativePay':
            case 'getsignkey':
                break;
            default:
                log.error(`receive data => ${JSON.stringify(json)}`)
                if (json.result_code !== 'SUCCESS') throw new Error(json.err_code || 'XMLDataError');
        }

        switch (type) {
            case 'getsignkey':
                break;
            case 'middleware_refund': {
                if (json.appid !== this.config.appId) throw new Error('appid不匹配');
                if (json.mch_id !== this.config.mchId) throw new Error('mch_id不匹配');
                let key = util.md5(this.config.partnerKey).toLowerCase();
                let info = util.decrypt(json.req_info, key);
                json.req_info = await util.parseXML(info);
                break;
            }
            case 'transfers':
                if (json.mchid !== this.config.mchId) throw new Error('mchid不匹配');
                break;
            case 'sendredpack':
            case 'sendgroupredpack':
                if (json.wxappid !== this.config.appId) throw new Error('wxappid不匹配');
                if (json.mch_id !== this.config.mchId) throw new Error('mchid不匹配');
                break;
            case 'gethbinfo':
            case 'gettransferinfo':
                if (json.mch_id !== this.config.mchId) throw new Error('mchid不匹配');
                break;
            case 'send_coupon':
            case 'query_coupon_stock':
            case 'querycouponsinfo':
                if (json.appid !== this.config.appId) throw new Error('appid不匹配');
                if (json.mch_id !== this.config.mchId) throw new Error('mch_id不匹配');
                break;
            case 'getpublickey':
                break;
            case 'paybank':
                if (json.mch_id !== this.config.mchId) throw new Error('mchid不匹配');
                break;
            case 'querybank':
                if (json.mch_id !== this.config.mchId) throw new Error('mchid不匹配');
                break;
            case 'combinedorder':
                if (json.combine_appid !== this.config.appId) throw new Error('appid不匹配');
                if (json.combine_mch_id !== this.config.mchId) throw new Error('mch_id不匹配');
                if (json.sign !== this.getSign(json, 'HMAC-SHA256')) throw new Error('sign签名错误');
                break;
            default:
                log.error(`receive data => ${JSON.stringify(json)}`)
                if (json.appid !== this.config.appId) throw new Error('appid不匹配');
                if (json.mch_id !== this.config.mchId) throw new Error('mch_id不匹配');
                if (json.sign !== this.getSign(json, json.sign_type || signType)) throw new Error('sign签名错误');
        }
        return json;
    }

    /**
     * 签名
     * @param params 
     * @param type 
     */
    getSign(params, type = 'MD5') {
        let str = util.toQueryString(params) + '&key=' + this.config.partnerKey;
        switch (type) {
            case 'MD5':
                return util.md5(str).toUpperCase();
            case 'HMAC-SHA256':
                return util.sha256(str, this.config.partnerKey).toUpperCase();
            default:
                throw new Error('signType Error');
        }
    }

    // 获取RSA公钥
    getPublicKey(params) {
        let pkg = {
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5'
        };
        return this.request(pkg, 'getpublickey', true);
    }

    // 获取JS支付参数(自动下单)
    async getPayParams(params) {
        params.trade_type = params.trade_type || 'JSAPI';
        let order = await this.unifiedOrder(params);
        return this.getPayParamsByPrepay(order, params.sign_type);
    }

    // 获取JS支付参数(通过预支付会话标志)
    getPayParamsByPrepay(params, signType) {
        let pkg = {
            appId: params.sub_appid || this.config.appId,
            timeStamp: '' + (Date.now() / 1000 | 0),
            nonceStr: util.generate(),
            package: 'prepay_id=' + params.prepay_id,
            signType: signType || 'MD5',
            paySign: '',
            timestamp: ''
        };
        pkg.paySign = this.getSign(pkg, signType);
        pkg.timestamp = pkg.timeStamp;
        return pkg;
    }

    // 获取APP支付参数(自动下单)
    async getAppParams(params) {
        params.trade_type = params.trade_type || 'APP';
        let order = await this.unifiedOrder(params);
        return this.getAppParamsByPrepay(order, params.sign_type);
    }

    // 获取APP支付参数(通过预支付会话标志)
    getAppParamsByPrepay(params, signType) {
        let pkg = {
            appid: params.sub_appid || this.config.appId,
            partnerid: params.sub_mch_id || this.config.mchId,
            prepayid: params.prepay_id,
            package: 'Sign=WXPay',
            noncestr: util.generate(),
            timestamp: '' + (Date.now() / 1000 | 0),
            sign: ''
        };
        pkg.sign = this.getSign(pkg, signType);
        return pkg;
    }

    // 扫码支付, 生成URL(模式一)
    getNativeUrl(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            time_stamp: '' + (Date.now() / 1000 | 0),
            nonce_str: util.generate()
        };

        let url = 'weixin://wxpay/bizpayurl'
            + '?sign=' + this.getSign(pkg)
            + '&appid=' + pkg.appid
            + '&mch_id=' + pkg.mch_id
            + '&product_id=' + encodeURIComponent(pkg.product_id)
            + '&time_stamp=' + pkg.time_stamp
            + '&nonce_str=' + pkg.nonce_str;
        return url;
    }

    // 拼装扫码模式一返回值
    private getNativeReply(prepay_id, err_code_des) {
        let pkg = {
            return_code: 'SUCCESS',
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            result_code: 'SUCCESS',
            prepay_id: '',
            err_code_des: '',
            sign: ''
        };

        if (err_code_des) {
            pkg.result_code = 'FAIL';
            pkg.err_code_des = err_code_des;
        }

        pkg.sign = this.getSign(pkg);
        return util.buildXML(pkg);
    }

    // 刷卡支付
    micropay(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5',
            spbill_create_ip: params.spbill_create_ip || this.config.spbillCreateIp
        };

        return this.request(pkg, 'micropay');
    }

    // 撤销订单
    reverse(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5'
        };

        return this.request(pkg, 'reverse', true);
    }

    // 统一下单
    unifiedOrder(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5',
            notify_url: params.notify_url || this.config.notify_url,
            spbill_create_ip: params.spbill_create_ip || this.config.spbillCreateIp,
            trade_type: params.trade_type || 'JSAPI'
        };

        return this.request(pkg, 'unifiedorder');
    }

    // 订单查询
    orderQuery(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5'
        };

        return this.request(pkg, 'orderquery');
    }

    // 关闭订单
    closeOrder(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5'
        };

        return this.request(pkg, 'closeorder');
    }

    // 申请退款
    refund(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5',
            op_user_id: params.op_user_id || this.config.mchId,
            notify_url: params.notify_url || this.config.refund_url
        };
        if (!pkg.notify_url) delete pkg.notify_url;

        return this.request(pkg, 'refund', true);
    }

    // 查询退款
    refundQuery(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5'
        };

        return this.request(pkg, 'refundquery');
    }

    // 合单支付
    combinedOrder(params) {
        let pkg = {
            ...params,
            combine_appid: this.config.appId,
            combine_mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: 'HMAC-SHA256',
            notify_url: params.notify_url || this.config.notify_url,
            spbill_create_ip: params.spbill_create_ip || this.config.spbillCreateIp,
            trade_type: params.trade_type || 'JSAPI'
        };

        return this.request(pkg, 'combinedorder');
    }

    // 下载对帐单
    async downloadBill(params, format = false) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'MD5',
            bill_type: params.bill_type || 'ALL'
        };

        let xml = await this.request(pkg, 'downloadbill');
        return this.parseBill(xml, format);
    }

    // 下载资金帐单
    async downloadFundflow(params, format = false) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            sign_type: params.sign_type || 'HMAC-SHA256',
            account_type: params.account_type || 'Basic'
        };

        let xml = await this.request(pkg, 'downloadfundflow', true);
        return this.parseBill(xml, format);
    }

    // 发放代金券
    sendCoupon(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            openid_count: params.openid_count || 1
        };

        return this.request(pkg, 'send_coupon', true);
    }

    // 查询代金券批次
    queryCouponStock(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate()
        };

        return this.request(pkg, 'query_coupon_stock');
    }

    // 查询代金券信息
    queryCouponInfo(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate()
        };

        return this.request(pkg, 'querycouponsinfo');
    }

    // 企业付款
    transfers(params) {
        let pkg = {
            ...params,
            mch_appid: this.config.appId,
            mchid: this.config.mchId,
            nonce_str: util.generate(),
            check_name: params.check_name || 'FORCE_CHECK',
            spbill_create_ip: params.spbill_create_ip || this.config.spbillCreateIp
        };

        return this.request(pkg, 'transfers', true);
    }

    // 查询企业付款
    transfersQuery(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate()
        };

        return this.request(pkg, 'gettransferinfo', true);
    }

    // 企业付款到银行卡
    async payBank(params) {
        const data = await this.getPublicKey(params);
        const pub_key = data && data.result_code === 'SUCCESS' ? data.pub_key : '';
        if (pub_key === '') throw new Error('get publickey fail');

        let pkg = {
            ...params,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            enc_bank_no: util.encryptRSA(pub_key, params.enc_bank_no),
            enc_true_name: util.encryptRSA(pub_key, params.enc_true_name)
        };

        return this.request(pkg, 'paybank', true);
    }

    // 查询企业付款到银行卡
    queryBank(params) {
        let pkg = {
            ...params,
            mch_id: this.config.mchId,
            nonce_str: util.generate()
        };

        return this.request(pkg, 'querybank', true);
    }

    // 发送普通红包
    sendRedpack(params) {
        let pkg = {
            ...params,
            wxappid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            client_ip: params.client_ip || this.config.spbillCreateIp,
            mch_billno: params.mch_billno || (params.mch_autono ? this.config.mchId + util.getFullDate() + params.mch_autono : ''),
            total_num: params.total_num || 1
        };
        delete pkg.mch_autono;

        return this.request(pkg, 'sendredpack', true);
    }

    // 发送裂变红包
    sendGroupRedpack(params) {
        let pkg = {
            ...params,
            wxappid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            mch_billno: params.mch_billno || (params.mch_autono ? this.config.mchId + util.getFullDate() + params.mch_autono : ''),
            total_num: params.total_num || 3,
            amt_type: params.amt_type || 'ALL_RAND'
        };
        delete pkg.mch_autono;

        return this.request(pkg, 'sendgroupredpack', true);
    }

    // 查询红包记录
    redpackQuery(params) {
        let pkg = {
            ...params,
            appid: this.config.appId,
            mch_id: this.config.mchId,
            nonce_str: util.generate(),
            bill_type: params.bill_type || 'MCHT'
        };

        return this.request(pkg, 'gethbinfo', true);
    }
}

const pay = Payment.sandbox({
    appId: 'wxd678efh567hg6787',
    mchId: '1230000109',
    notify_url: '支付回调网址',
    spbillCreateIp: 'IP地址',
    sandbox: true,
    debug: true
})
for (let index = 0; index < 1; index++) {
     pay.then(item => {
         
        item.unifiedOrder({
            out_trade_no: '1111122',
            body: '商品简单描述',
            total_fee: '10',
            openid: '',
            trade_type: 'JSAPI',
            product_id: '商品id'
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
     }).catch(err => {
         console.log(err)
         log.error(`pay err ${err}`) 
     })
    
}
export default Payment