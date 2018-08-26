import request from 'request'
import monk from 'monk'
import setting from './config'
process.env.UV_THREADPOOL_SIZE = 128
var config = {
    url: 'http://m.soyoung.com/yuehui/product?ajax=1&lver=6.3.9',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15'
    },
    qs: {},
    'Cookie': 'Hm_lpvt_043bb3729b5d18b3373f4f287baed3ec=1534301410; Hm_lvt_043bb3729b5d18b3373f4f287baed3ec=1534301405; Hm_lpvt_b366fbb5465f5a86e1cc2871552e1fdb=1534301410; Hm_lvt_b366fbb5465f5a86e1cc2871552e1fdb=1534301406; _ga=GA1.2.511816071.1534301407; _gid=GA1.2.331507921.1534301407; _gat=1; PHPSESSID=84e177188434d33dbbbdfb2129233245; __usersign__=1534301403378232781; __jsluid=eb8f1c2e0754d7aabc27bc4bfbf63734',
    proxy: ''
}
var page = 10
var db = '';
db = monk('localhost:27017/reptile');
db.then(() => {
    console.log('数据库链接成功')
})

// export default {
//  ipRequestNumber: 40
// }

class proxy {
    constructor() {
        this.proxy_list = []
    }

    getIp() {
        request({
            url: setting.proxy,
            method: 'GET',
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
            },
            json: true
        }, (err, res) => {
            this.proxy_list = res.body.data.proxy_list.map((item, index) => item = 'http://' + item)
            console.log(this.proxy_list)
        })
    }

    updateIp() {
        return this.proxy_list
        soyoung.opts.proxy = this.proxy_list[0]
        //
        this.proxy_list.shift()
        if (this.proxy_list.length < 5) {

        }
    }
}

var _proxy = new proxy()
console.log(_proxy.updateIp())
// console.log(_proxy.getIp())

var soyoung = {
    opts: {
        page: 0,
        proxy: ''
    },
    requestNumber: 0,
    init () {



        // this.request()
        this.getIp()
    },
    getIp () {
        request({
            url: setting.proxy,
            method: 'GET',
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
            },
            json: true
        }, ((err, res) => {
            if (err) console.log(`代理 -> ${err}`)
            this.rp(res.body.data.proxy_list.map((item, index) => item = 'http://' + item))

        }))
    },
    rp (proxyData) {
        console.log(proxyData)
        //
        // requestNumber++
        // 首次进来以后 拿ip　循环总页码　去请求接口、在请求接口结束以后　去改变参数页码、判断当前ip请求次数
        // 筛选条件
        // 首次和update
        // city Id :1 北京
        // city Id :2 天津
        //
        // let arr = []
        // let opts = config
        // // let num = 0
        // for (var i = 1; i <= page; i++) {
        //
        //     // if (i % 10 == 0) {
        //     //     num++
        //     // }
        //     if (num >= proxyData.length) {
        //         this.getIp()
        //     }
        // }
        // for (var i = 0; i < arr.length; i++) {
        //     opts.from = {
        //         index: arr[i].index
        //     }
        //     opts.proxy = arr[i].proxy
        //
        //     console.log(opts)
        //     // request(opts, this.callback.bind(this))
        //     request(opts, (error, response, body) => {
        //         if (body.view.result.length === 0) {
        //             // update city
        //             // 页码为空
        //             //
        //         }
        //         if (error) {
        //
        //         }
        //         console.log(body)
        //         if (this.requestNumber > 10) {
        //           this.requestNumber = 0
        //           _proxy.updateIp()
        //         }
        //     })
        // }
        // arr.map((val, key) => {
        //     opts.proxy = val.proxy
        //     opts.from = {
        //         index: val.index
        //     }
        //     console.log(opts)
        //     request(opts, this.callback.bind(this))
        // })


        config.form = {
            index: 19
        }
        config.proxy = 'http://59.52.186.13:25012'
        // config.proxy = 'http://106.46.125.221:17912'
        request(config, this.callback(err, res, body))

    },
    callback (err, res, body) {
        if (err) {
            console.log(err)
            return err
        }
        // console.log(body)
        var product = JSON.parse(body).result.product_info;
        // console.log(product)
        if (product.length <= 0) {
            console.log('无数据')
            return
        }
        product.map((val, key) => {
            var data = {
                sku_id: val.pid,
                title: val.title,
                hospital_name: val.hospital_name,
                city: val.city_name,
                // doctor: val.doctor ? val.doctor[0].name_cn : '',
                // doctor_id: val.doctor ? val.doctor[0].doctor_id : '',
                'price': {
                    'origin': val.price_origin,
                    'current': val.price_online,
                    'prepay': val.price_deposit,
                    'postpay': val.price,
                }
            }

            db.get('product').findOne({'sku_id': data.sku_id}).then((doc) => {
                if (doc) {
                    db.get('product').update(doc, data)
                    console.log(`updata ->  ${data.sku_id}`)
                } else {
                    db.get('product').insert(data)
                    console.log(`insert ->  ${data.sku_id}`)
                }
            }).catch((error) => {
                console.log(error)
            })
        })

    },
    wait  (mils) {
        let now = new Date()
        mils = mils || 1000
        while (new Date() - now <= mils) {
        }
    }
}
soyoung.init()
