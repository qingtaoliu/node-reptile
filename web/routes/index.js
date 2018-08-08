var express = require('express');
var router = express.Router();
let yuemei = require('./yuemei')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'reptile'});
});

router.get('/api/yuemei/_data', function (req, res, next) {
    yuemei(req, res)
})

module.exports = router;