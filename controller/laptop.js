/**
 * Laptop Controller
 */

var http = require('http');

module.exports  = {
	on: function(req, res) {
		var url = "http://ex20.iptime.org:5678/cgi-bin/timepro.cgi?tmenu=expertconf&smenu=remotepc&act=wake"
		url = "http://localhost:3000/boiler/info.json";

		http.get(url, function(sRes){
			console.log("WOL Request Status Code: " + sRes.statusCode);
			if(sRes.statusCode >= 200 && sRes.statusCode < 400) {
				res.send({success: false});
				return;
			}
			
			res.send({success: true});
			
		}).on('error', function(e){
			console.log("error");
			res.send({success: false});
		});
		
	}
};