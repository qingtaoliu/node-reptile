var express = require('express');
var router = express.Router();
let yuemei = require('./yuemei')
var users = require('./users')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'reptile'});
});

router.post('/api/login/_data', function (req, res) {
    users.login(req, res)
})

router.get('/api/yuemei/_data', function (req, res, next) {
    yuemei(req, res)
})

module.exports = router;