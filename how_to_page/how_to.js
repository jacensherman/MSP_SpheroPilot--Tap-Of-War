initialize();

function initialize () {
	orb_functions();
}

function orb_functions() {
	var sphero = require("sphero");
	var orb = sphero("COM4");
	
	orb.connect(function() {
	  // roll orb in a random direction, changing direction every second
	   var stop = orb.roll.bind(orb, 0, 0),
	       roll = orb.roll.bind(orb, 60);
	  
	  $("#move_button").mousedown(function() { roll(0); });
	  $("#move_button").mouseup(function() { stop(); });
	});
}