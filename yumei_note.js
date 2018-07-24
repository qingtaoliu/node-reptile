/**
 * Created by LiuQingtao on 2018/7/20.
 */
import request from 'request'
import cheerio from 'cheerio'
import monk from 'monk'
import config from './config'

class yumeiTopic {
    staticOption() {
        return {
            url: 'https://note.yuemei.com/:page.html',
            method: 'GET',
            proxy: '',
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
            },
            Cookie: 'ym_onlyk=1521085489503902; ym_onlyknew=15210854895104; UM_distinctid=16227c2b582170-0707a48514bbfd-32607b05-fa000-16227c2b583a4c; gr_user_id=402aaa66-f07f-42ad-a54f-b060f5072ffd; _yma=1521085497528; Hm_lvt_f6a77f0034420264f7096c949533acc2=1521085674; Hm_lvt_bbb28c93aca8fe7e95a44b2908aabce7=1532078226; gr_session_id_81dc44536fef8b41=7ea9c5d5-fa81-4413-8161-157f2270e9ec; gr_session_id_81dc44536fef8b41_7ea9c5d5-fa81-4413-8161-157f2270e9ec=true; YUEMEI=bmdffi3u2b8c2ap776ssbomdc0; yuemei_city=beijing; __jsluid=caa3ed98b3acc7c678b19369af1f5714; CNZZDATA1253703185=1653286305-1532073899-https%253A%252F%252Fwww.yuemei.com%252F%7C1532073899; Hm_lpvt_bbb28c93aca8fe7e95a44b2908aabce7=1532078273'
        }
    }

    constructor() {
        this.page = 20, // page数量
        this.proxyum = 5  //一个ip请求5个地址
    }

    init() {
        this.connect()
        this.getIp()
    }

    getIp() {
        request({
            url: config.proxy,
            method: 'GET',
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
            },
            json: true
        }, ((err, res) => {
            if (err) console.log(`代理 -> ${err}`)
            let proxyData = JSON.stringify(res.body.data.proxy_list)
            this.rp(proxyData)

        }).bind(this))

    }

    connect() {
        this.db = monk(config.mongoUrl);
        this.db.then(() => {
            console.log('数据库链接成功')
        })
    }

    eachUrl() {
        const page = this.page;
        let urlArr = [];
        for (let i = 1; i <= page; i++) {
            urlArr.push(this.staticOption().url.replace(':page', `p${i}`))
        }
        return urlArr;
    }

    rp(proxyData) {
        let _this = this;
        let option = this.staticOption();
        let urlArr = _this.eachUrl();
        let arr = []
        let num = 0
        let proxyList = proxyData
        for (let k in urlArr) {
            if (k < this.proxyum) {
                num++
            }
            arr.push({
                proxy: `http://${proxyList[num]}`,
                url: urlArr[k]
            })
        }
        arr.forEach((item, key) => {
            option.url = item.url
            option.porxy = item.proxy
            request(option, _this.callback.bind(this))
        })

    }

    callback(err, response) {
        if (err) {
            console.log(err)
            return
        }
        let html = response.body;
        let $ = cheerio.load(html)
        this.saveData($);
    }

    saveData($) {
        let slideList = $('body').find('.list-link');
        let _this = this;
        slideList.each(function (item) {
            let $this = $(this);
            let topicInfo = {
                'creat_time': new Date(),
                'topic_id': $this.attr('href').match(/\d+/ig).join(),
                'content': _this.entityToString($this.find('div.img-text').html()),
                'portrait': $this.find('div.head-img img').attr('src'),
                'before_img': $this.find('div.left img').attr('src'),
                'after_image': $this.find('div.right img').attr('src'),
                'user_name': $this.find('div.c-333').text()
            }
            _this.db.get('yuemei').findOne({'topic_id': topicInfo.topic_id}).then(doc => {
                if (doc) {
                    _this.db.get('yuemei').update(doc, topicInfo)
                    console.log('update')
                } else {
                    _this.db.get('yuemei').insert(topicInfo)
                    console.log('insert')
                }
            })

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
let topic = new yumeiTopic()
topic.init()