/**
 * Boiler Controller
 */
var gpio = require("gpio");
var boilerValid = false;
var boiler = gpio.export(4, {direction: "out", ready: function(){ boilerValid=true; } });
var temperatureValid = false;
var temperature = gpio.export(5, {direction: "in", ready: function(){ temperatureValid=true; }});

function getTemperature() {
	if(!temperatureValid){
		return -99;
	}
	
	return temperature.value;
}

function getBoilerStatus() {
	if(!boilerValid){
		return "off";
	}
	
	return boiler.value;
}

module.exports = {
	info: function(req, res) {
		res.send({temp: getTemperature(), boilerStatus: getBoilerStatus()});
	},
	
	update: function(req, res) {
		if(!boilerValid) {
			res.send({success: false, boilerStatus: "off"});
			return;
		}
		
		var status = req.query.status;
		if(status === "on") {
			boiler.set(function() {
				res.send({success: true, boilerStatus: boiler.value});
			});
			
		} else if (status === 'off'){
			boiler.set(0, function() {
				res.send({success: true, boilerStatus: boiler.value});
			});
		}
	}
};

