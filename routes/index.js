var express = require('express');
var router = express.Router();
var boiler = require('../controller/boiler');
var laptop = require('../controller/laptop');


/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'SungHyun Home'});
});

router.get('/boiler/info.json', boiler.info);

router.get('/boiler/update.json', boiler.update);

router.get("/laptop/on.json", laptop.on);
	

module.exports = router;
