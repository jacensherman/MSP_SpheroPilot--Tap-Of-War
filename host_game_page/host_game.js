initialize();

function initialize () {
	orb_functions();
	
	$("#cancel_btn").click(function() {
		window.location.href = "../menu_page/menu.html";
	});
	
	var rotation_degree = 1;
	setInterval(function() {
		rotation_degree++;
		if (rotation_degree == 361) rotation_degree = 1;
		$("#loading_img").css({ WebkitTransform: 'rotate(' + rotation_degree + 'deg)'});
	}, 5);
}

function orb_functions() {
	var sphero = require("sphero");
	var orb = sphero("COM4");
	
	orb.connect(function() {
	   
	    $("#loading_txt").html("WAITING FOR</br>OPPONENT");
	   
		var stop = orb.roll.bind(orb, 0, 0),
	        roll = orb.roll.bind(orb, 60);
	  
	  	$("#move_button").mousedown(function() { roll(0); });
	  	$("#move_button").mouseup(function() { stop(); });
	});
}