var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'SungHyun Home' });
});

router.get('/boiler/info.json', function(req, res){
	res.send({temp: getTemperature(), boilerStatus: getBoilerStatus()});
});

router.get('/boiler/on.json', function(req, res){
	turnOnBoiler();
	res.send({success: true, boilerStatus: "on"});
});

router.get("/boiler/off.json",function(req, res){
	turnOffBoiler();
	res.send({success: true, boilerStatus: "off"});
});

router.get("/laptop/on.json", function(req,res) {
	var url = "http://ex20.iptime.org:5678/cgi-bin/timepro.cgi?tmenu=expertconf&smenu=remotepc&act=wake"
	url = "http://localhost:3000/boiler/on.json";

	http.get(url, function(res){
		if(res.statusCode >= 200 && res.statusCode < 400) {
			res.send({success: false});
		}
		
		console.log(res.statusCode);
		res.on("data", function(buffer){
			console.log(buffer.toString('utf8'));
		});
	}).on('error', function(e){
		console.log("error");
		res.send({success: false});
	});
});

function getTemperature() {
	return 12;
}

function getBoilerStatus() {
	return "on";
}

function turnOnBoiler() {
	
}

function turnOffBoiler() {
	
}

module.exports = router;
