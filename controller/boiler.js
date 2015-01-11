/**
 * Boiler Controller
 */
var gpio = require("pi-gpio");
var ADC = require("adc-pi-gpio");

var tempConnected = false;
var boilerStatus = "on";

var PIN = {BOILER: 7};

/* boiler switch */
gpio.open(PIN.BOILER, "output", function(err){
	if(err) { console.error(err); }
});

/*SPI*/
var SPI_CHANNEL = {TEMP: 0};

var config  = {
		tolerance: 2,
		interval: 300,
		channels: [SPI_CHANNEL.TEMP],
		SPICLK: 23,
		SPIMISO: 21,
		SPIMOSI: 19,
		SPICS: 24
	};
var adc = new ADC(config);

process.on('SIGTERM', function() {
	adc.close();
});
process.on('SIGINT', function() {
	adc.close();
});
adc.init();
adc.on('ready', function() {
	tempConnected = true;
});
adc.on('close', function() {
    console.log('ADC terminated');
    process.exit();
});

function getTemperature() {
	if(!tempConnected) {
		return -99;
	}
	adc.read(SPI_CHANNEL.TEMP, function(data) {
		return data;
	});
}

module.exports = {
	info: function(req, res) {
		res.send({temp: getTemperature(), boilerStatus: boilerStatus});
	},
	
	update: function(req, res) {
		var status = req.query.status;
		if(status === "on") {
			// normally closed = > "on" as default
			gpio.write(PIN.BOILER, 0, function(err) {
			    if(err) {
			    	res.send({success: false, boilerStatus: boilerStatus});
			    } else {
			    	boilerStatus = "on";
			    	res.send({success: true, boilerStatus: boilerStatus});
			    }
			});
			
		} else if (status === 'off'){
			gpio.write(PIN.BOILER, 1, function(err) {
				if(err) {
					res.send({success: false, boilerStatus: boilerStatus});
				} else {
					boilerStatus = "off";
					res.send({success: true, boilerStatus: boilerStatus});
				}
			});
		}
		
	}
};

