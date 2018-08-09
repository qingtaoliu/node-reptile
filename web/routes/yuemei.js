/**
 * Created by LiuQingtao on 2018/7/26.
 */
let monk = require('monk')
let db = monk('localhost:27017/reptile')

function getData(req, res) {
    var page = req.query.page || 1;
    var limit = req.query.count || 20;
    db.get('yuemei').find({}, (err, docs) => {
        var data = docs.slice((page - 1) * limit, page * limit)
        var total = docs.length;
        res.end(
            JSON.stringify({
                error: 0,
                massage: '',
                data: {
                    list: data,
                    total: total
                },
            })
        )
    })
}


module.exports = getData