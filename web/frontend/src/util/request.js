/**
 * Created by LiuQingtao on 2018/8/9.
 */
import axios from 'axios'

let base = 'http://localhost:8080'

axios.interceptors.request.use((config) => {
    return config
}, (err) => {
    alert('请求超时')
    return Promise.resolve(err)
})

axios.interceptors.response.use((data) => {
    // 数据统一校验处理
    return data
}, (err) => {
    // 数据异常统一处理
    if (err.response.status === 504 || err.response.status === 404) {
        alert('服务器被吃了')
    } else if (err.response.status === 403) {
        alert('权限不足,请联系管理员')
    } else {
        alert('未知错误')
    }
    return Promise.resolve(err)
})

export function postRequest (url, params) {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export function getRequest (url) {
    return axios({
        method: 'get',
        url: `${base}${url}`
    })
}
