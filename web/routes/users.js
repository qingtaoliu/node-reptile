module.exports = {
    login: function (req, res) {
        var user = req.body.user;
        var pass = req.body.pass;
        if ((user == 'admin') && pass == 123456) {
            res.end(JSON.stringify({
                error: 0,
                message: '登录成功',
                data: {
                    userName: '柳青涛',
                    id: 1,
                    portrait: 'http://hera.s.igengmei.com/2018/08/09/4a5eb220f1'
                }
            }))
        } else {
            res.end(JSON.stringify({
                error: 1,
                message: '用户名密码错误',
                data: ''
            }))
        }
    }
}
