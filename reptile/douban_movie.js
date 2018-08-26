/**
 * Created by LiuQingtao on 2018/8/15.
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
let config = {
    url: 'https://movie.douban.com/top250',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'userAgent': userAgent[util.randomFn()]
    },
    mongoUrl: configs.mongoUrl

}


class douban {
    connect() {
        this.db = monk(config.mongoUrl);
        this.db.then(() => {
            console.log('数据库链接成功')
        })
    }

    rp(url) {
        var _this = this
        console.log('url: ' + url)
        console.log('headers: ' + config.headers.userAgent)
        request({
            url: url || config.url,
            headers: config.headers,
            method: "GET",
        }, function (err, res, body) {
            let $ = cheerio.load(body)
            var movieList = $('.grid_view li')
            var obj = {}
            movieList.each(function (item) {
                obj = {
                    movieRanking: movieList.eq(item).find('.pic em').html(),
                    movieCover: movieList.eq(item).find('.pic img').attr('src'),
                    movieName: _this.entityToString(movieList.eq(item).find('.hd a span').eq(0).html()),
                    info: _this.entityToString(movieList.eq(item).find('.bd p').html()),
                    star: movieList.eq(item).find('.star .rating_num').html(),
                    evaluate: movieList.eq(item).find('.star span').last().html().replace(/[\u4e00-\u9fa5]+/, ''),
                    quote: _this.entityToString(movieList.eq(item).find('.quote span').html())
                }
                _this.saveData(obj)
            })
            var nextPage = $('.next a').attr('href')
            if (nextPage) {
                _this.rp(config.url + nextPage)
            } else {
                _this.endFn()
            }
        })
    }

    saveData(data) {
        this.db.get('doubanMovie').findOne({'movieRanking': data.movieRanking}).then((doc) => {
            if (doc) {
                this.db.get('doubanMovie').update(doc, data)
                console.log(`update top ${data.movieRanking} 名字 ${data.movieName}`)
            } else {
                this.db.get('doubanMovie').insert(data)
                console.log(`inser top ${data.movieRanking} 名字 ${data.movieName}`)

            }
        })
    }

    endFn() {
        console.log('结束')
        this.db.close()
        process.exit()
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
douban = new douban()
douban.connect()
douban.rp()
