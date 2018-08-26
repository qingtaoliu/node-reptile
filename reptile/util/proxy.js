/**
 * Created by LiuQingtao on 2018/8/14.
 */
import request from 'request'
import config from '../config'
var proxyData = null
function callback(err, res) {
    if (err) console.log(`代理 -> ${err}`)
    proxyData = JSON.stringify(res.body.data.proxy_list)
    // return proxyData
    console.log('111' + proxyData)
}
export default {
    getIp (call) {
        request({
            url: config.proxy,
            method: 'GET',
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
            },
            json: true
        }, callback)
        console.log(proxyData)
        return proxyData
    }
}