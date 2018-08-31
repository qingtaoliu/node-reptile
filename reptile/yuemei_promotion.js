/**
 * Created by LiuQingtao on 2018/8/30.
 */
import request from 'request'
import cheerio from 'cheerio'
import configs from './config'
import monk from 'monk'

let util = {
    randomFn() {
        return Math.floor(Math.random() * 20 + 1)
    }
}
let userAgent = [
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; AcooBrowser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)",
    "Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.5; AOLBuild 4337.35; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)",
    "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.04506.30)",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)",
    "Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0",
    "Mozilla/5.0 (X11; Linux i686; U;) Gecko/20070322 Kazehakase/0.4.5",
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52",
]
let proxyList = []
process.env.UV_THREADPOOL_SIZE = 128
class yueMeiPromotion {
    staticOption() {
        return {
            url: 'https://m.yuemei.com/tao/beijing/p1.html',
            method: 'GET',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'userAgent': userAgent[util.randomFn()]
            },
            proxy: ''
        }
    }

    constructor() {
        this.proxyList = ''
        this.proxyNum = 0
        this.requestNum = 0

    }

    connect() {
        this.db = monk(configs.mongoUrl);
        this.db.then(() => {
            console.log('数据库链接成功')
        })
    }

    proxy() {
        let _this = this
        request({
            url: configs.proxy,
            method: 'GET',
            json: true
        }, (req, res, body) => {
            _this.proxyList = res.body.data.proxy_list.map(item => item = `http://${item}`)
        })
    }

    rp(url) {
        var config = this.staticOption()
        var _this = this
        let params = {
            url: url || config.url,
            method: config.method,
            headers: config.headers,
            proxy: _this.proxyList[_this.proxyNum]
        }
        console.log(params)
        console.log('代理位置' + _this.proxyNum)
        console.log('请求次数' + this.requestNum)
        _this.requestNum++
        request(params, (req, res, body) => {
            let $ = cheerio.load(body)
            let list = $('.serve-cont a');
            let next_url = $('.next').attr('href')
            let obj = {}
            list.each(item => {
                obj = {
                    url: list.eq(item).attr('href'),
                    server_id: list.eq(item).attr('href').replace(/[^0-9]/ig, ""),
                    server_name: this.entityToString(list.eq(item).find('p.teyao-tit').html()),
                    doctor: this.entityToString(list.eq(item).find('.infoTit2').html()).replace(/\s+/g, "").split('，')[0],
                    hospital: this.entityToString(list.eq(item).find('.infoTit2').html()),
                    price: list.eq(item).find('.ft20').html()
                }
                _this.saveData(obj)
            })
            if (next_url) {
                _this.rp(next_url)
            } else {
                console.log('没有了')
            }
            if (_this.requestNum > 20) {
                _this.proxyNum++
                _this.requestNum = 0
            }
            if (_this.proxyNum >= _this.proxyList.length) {
                _this.proxy()
            }

        })
    }

    saveData(data) {
        this.db.get('yuemei_promotion').findOne({'server_id': data.server_id}).then((doc) => {
            if (doc) {
                this.db.get('yuemei_promotion').update(doc, data)
                // console.log(`update 美购id ${data.server_id} }`)
            } else {
                this.db.get('yuemei_promotion').insert(data)
                // console.log(`inser 美购id ${data.server_id} `)

            }
        })
    }

    entityToString(entity) {
        let entities = entity.split(';')
        entities.pop()
        let tmp = ''
        for (let i = 0; i < entities.length; i++) {
            let num = entities[i].trim().slice(2)
            if (num[0] === 'x')//10进制还是16进制
                num = parseInt(num.slice(1), 16);
            else num = parseInt(num);
            tmp += String.fromCharCode(num)
        }
        return tmp

    }
}
var yuemei = new yueMeiPromotion()
yuemei.proxy()
yuemei.connect()
yuemei.rp()