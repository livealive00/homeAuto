/**
 * Boiler Controller
 */
var gpio = require("pi-gpio");
var ADC = require("adc-pi-gpio");

var tempConnected = false;
var tempSaved = "ERR";
var boilerStatus = "on";
var BSIGN = {ON: 0, OFF: 1};
var BSIGN_INIT = BSIGN.ON;

var PIN = {BOILER: 7};

/* boiler switch */
gpio.open(PIN.BOILER, "output", function(err){
	if(err) { console.error(err);}
	gpio.write(PIN.BOILER, BSIGN_INIT, function(err) {});
});

/*SPI*/
var SPI_CH = {TEMP: 0};

var config  = {
		tolerance: 8,
		interval: 60*1000,	// 1min
		channels: [SPI_CH.TEMP],
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
	adc.read(SPI_CH.TEMP, function(data){
		saveTemp(data);
	});
});
adc.on('close', function() {
    console.log('ADC terminated');
	gpio.close(PIN.BOILER);
    process.exit();
});
adc.on('change', function(data) {
	console.log("spi changed event - " + data);
	if(data.channel == SPI_CH.TEMP) {
		saveTemp(data.value);
	}
});

function saveTemp(data) {
	tempSaved = convertTemp(data);
	console.log("Temp Saved : " + tempSaved);
}
function convertTemp(data) {
	// data is 12bit value from adc 
	var vcc = 3.3;
	var voltOffset = 0.5;
	var curVolt = (data*vcc) / 4095;
	var curTemp = 100*(curVolt-voltOffset);
	return Math.round(curTemp);
}

module.exports = {
	info: function(req, res) {
		if(tempConnected) {
			res.send({temp: tempSaved, boilerStatus: boilerStatus});
		} else {
			res.send({temp: "ERR", boilerStatus: boilerStatus});
		}
	},
	
	update: function(req, res) {
		var status = req.query.status;
		if(status === "on") {
			// normally closed = > "on" as default
			gpio.write(PIN.BOILER, BSIGN.ON, function(err) {
			    if(err) {
			    	res.send({success: false, boilerStatus: boilerStatus});
			    } else {
			    	boilerStatus = "on";
			    	res.send({success: true, boilerStatus: boilerStatus});
			    }
			});
			
		} else if (status === 'off'){
			gpio.write(PIN.BOILER, BSIGN.OFF, function(err) {
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

