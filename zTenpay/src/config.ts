/*
 * @Author: zhangpeiyu
 * @Date: 2021-01-24 00:51:35
 * @LastEditTime: 2021-01-24 03:50:19
 * @Description: 我不是诗人，所以，只能够把爱你写进程序，当作不可解的密码，作为我一个人知道的秘密。
 */
export class RequestParam extends Object{
    url: string
    method: string
    dataType: string
    body: string
    timeout: Array<number>
    // 证书
    pfx?: any
    // 密钥
    passphrase?: string
}
export class Config {
    appId: string
    mchId: string
    partnerKey?: string
    pfx?: string
    notify_url: string
    refund_url?: string
    spbillCreateIp: string
    sandbox?: boolean
    enableProxy?: boolean
    host?: string
    port?: string
    urls?: typeof TenPayUrl.url

    // debug模式
    debug?: boolean
}

export class TenPayUrl {
    static sandboxUrl: object = {
        micropay: 'https://api.mch.weixin.qq.com/sandboxnew/pay/micropay',
        reverse: 'https://api.mch.weixin.qq.com/sandboxnew/secapi/pay/reverse',
        unifiedorder: 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder',
        orderquery: 'https://api.mch.weixin.qq.com/sandboxnew/pay/orderquery',
        closeorder: 'https://api.mch.weixin.qq.com/sandboxnew/pay/closeorder',
        refund: 'https://api.mch.weixin.qq.com/sandboxnew/secapi/pay/refund',
        refundquery: 'https://api.mch.weixin.qq.com/sandboxnew/pay/refundquery',
        downloadbill: 'https://api.mch.weixin.qq.com/sandboxnew/pay/downloadbill',
        downloadfundflow: 'https://api.mch.weixin.qq.com/sandboxnew/pay/downloadfundflow',
        send_coupon: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaymkttransfers/send_coupon',
        query_coupon_stock: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaymkttransfers/query_coupon_stock',
        querycouponsinfo: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaymkttransfers/querycouponsinfo',
        transfers: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaymkttransfers/promotion/transfers',
        gettransferinfo: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaymkttransfers/gettransferinfo',
        sendredpack: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaymkttransfers/sendredpack',
        sendgroupredpack: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaymkttransfers/sendgroupredpack',
        gethbinfo: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaymkttransfers/gethbinfo',
        paybank: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaysptrans/pay_bank',
        querybank: 'https://api.mch.weixin.qq.com/sandboxnew/mmpaysptrans/query_bank',
        getsignkey: 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey',
    }

    static url: object = {
        micropay: 'https://api.mch.weixin.qq.com/pay/micropay',
        reverse: 'https://api.mch.weixin.qq.com/secapi/pay/reverse',
        unifiedorder: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        orderquery: 'https://api.mch.weixin.qq.com/pay/orderquery',
        closeorder: 'https://api.mch.weixin.qq.com/pay/closeorder',
        refund: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
        refundquery: 'https://api.mch.weixin.qq.com/pay/refundquery',
        downloadbill: 'https://api.mch.weixin.qq.com/pay/downloadbill',
        downloadfundflow: 'https://api.mch.weixin.qq.com/pay/downloadfundflow',
        send_coupon: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/send_coupon',
        query_coupon_stock: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/query_coupon_stock',
        querycouponsinfo: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/querycouponsinfo',
        transfers: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
        gettransferinfo: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gettransferinfo',
        sendredpack: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack',
        sendgroupredpack: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendgroupredpack',
        gethbinfo: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo',
        paybank: 'https://api.mch.weixin.qq.com/mmpaysptrans/pay_bank',
        querybank: 'https://api.mch.weixin.qq.com/mmpaysptrans/query_bank',
        getpublickey: 'https://fraud.mch.weixin.qq.com/risk/getpublickey',
        combinedorder: 'https://api.mch.weixin.qq.com/pay/combinedorder',
        getsignkey: 'https://api.mch.weixin.qq.com/sandboxnew/pay/getsignkey',
    };
}

