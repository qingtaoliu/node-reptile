/**
 * Created by LiuQingtao on 2018/7/26.
 */
const APIS = [
    '/hybrid/',
    '/api/'
]

// const target = 'https://backend.igengmei.com'
const target = 'http://127.0.0.1:3000/'

const onProxyReq = proxyReq => {}
module.exports = APIS.reduce((result, curr) => {
    result[curr] = {
        target,
        onProxyReq,
        changeOrigin: true
    }
    return result
}, {})
