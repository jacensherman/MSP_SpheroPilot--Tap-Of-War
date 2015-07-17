"use strict";

/* global $ */
$(document).ready(function() {
	initialize();
});

var rotation_interval;
function initialize () {
	orb_functions();
	
	$("#cancel_btn").click(function() {
		window.location.href = "../menu_page/menu.html";
	});
	
	var rotation_degree = 1;
	rotation_interval = setInterval(function() {
		rotation_degree++;
		if (rotation_degree == 361) rotation_degree = 1;
		$("#loading_img").css({ WebkitTransform: 'rotate(' + rotation_degree + 'deg)'});
	}, 5);
	
	$("#player-number").html(localStorage.getItem("player_id"));
}

var spheroRollSpeed = 0;
function orb_functions() {
	var sphero = require("sphero");
	var orb = sphero("COM4");
	
	orb.connect(function() {
		
		$("#loading_txt").html("WAITING FOR</br>OPPONENT");
		$("#calibrate_holder").css("opacity", "1");
		var stop = orb.roll.bind(orb, 0, 0), roll = orb.roll.bind(orb, 60);
	  	$("#loading_txt").mousedown(function() { roll(0); });
	  	$("#loading_txt").mouseup(function() { stop(); });
		
		orb.setBackLed(127);
		
		setInterval(function () {
			orb.roll(1, sliderPosition, 2, function() {});
		}, 200);
		
		var game_start_interval = setInterval(function() {
			// This is true once the game has officially started
			if (spheroRollSpeed != 0) {
				clearInterval(game_start_interval);
				// Locks in the sphero's calibration heading and turns off the backlight
				orb.setHeading(0, function() {
			      	orb.roll(0,0,1);
			    });
				orb.setBackLed(0);
				
				// Sets the sphero up for updating in the direction that the player is rolling it in
				setInterval(function() {
					var direction = 0;
					if (spheroRollSpeed > 0) {
						direction = 0;
					} else {
						direction = 180;
					}
					sphero.roll(spheroRollSpeed * 30, direction);
				}, 200);
			}
		}, 20);
		
		initializeSlider();
	});
	
}

var currentMousePosX = -1, currentMousePosY = -1;
var sliderPosition = 0; // A number from 0 to 360
function initializeSlider() {
	// SLIDER CODE
	$(document).mousemove(function (event) {
		currentMousePosX = event.pageX;
		currentMousePosY = event.pageY;
	});
	$("#slider_holder").mousemove(function () {
		
		var holderLeft = $("#slider_holder").offset().left;
		var holderWidth = $("#slider_holder").width();
		
		var mouseOffset = currentMousePosX - holderLeft;
		var mouseOffsetPercent = mouseOffset / holderWidth;
		
		$("#stats").html(sliderPosition);
		
		$("#slider").css("left", (mouseOffsetPercent * 100) - 2 + "%");
		
		if (holderLeft + 10 > $("#slider").offset().left) {
			$("#slider").css("left", "0%");
		}
		if (holderLeft + holderWidth < $("#slider").offset().left + $("#slider").width() - 5) {
			$("#slider").css("left", "95%");
		}
		
		sliderPosition = mouseOffsetPercent * 360;
		if (sliderPosition > 360) {
			sliderPosition = 360;
		} else if (sliderPosition < 0) {
			sliderPosition = 0;
		}
	});
}

function switchScreen(pageTo) {
	if (pageTo == "connect") {
		$("#game_setup_page").css("left", "100%");
		$("#in_game_page").css("left", "0%");
	} else if (pageTo == "game") {
		$("#game_setup_page").css("left", "100%");
		$("#in_game_page").css("left", "0%");
	}
}

// Database Connection
function checkOpponentArrival() {
	var sql = require('mssql'); 
	
	var config = {
	    user: '{Your Database Username}',
	    password: '{Your Database Password}',
	    server: '{Your Database Server}',
	    database: 'Tap_Of_War',
	
	    options: {
	        encrypt: true // Use this if you're on Windows Azure
	    }
	}
	
	var connection = new sql.Connection(config, function(err) {
	    var request2 = new sql.Request(connection); // or: var request = connection.request();
		request2.query('SELECT * FROM Game_Table', function(err, recordset) {
			var playerID = parseInt(localStorage.getItem("player_id"));
			var gameInstance;
			
			for (var i = 0; i < recordset.length; i++) {
				if (recordset[i].ID == playerID) {
					gameInstance = recordset[i];
				}
			}
			
			if (recordset == null || gameInstance == null) {
				alert("Error connecting to the server.");
				alert("Exiting to meny, sorry :(");
				window.location.href = "../menu_page/menu.html";
			} else {
				if (gameInstance.Opponent_ID == "-"){
					setTimeout(checkOpponentArrival, 500);
				} else {
					localStorage.setItem("opponent_id", gameInstance.Opponent_ID.toString());
					$("#loading_txt").html("OPPONENNT</br>FOUND");
					readyToPlay();
				}
			}
	    });
	});
}

function readyToPlay () {
	clearInterval(rotation_interval);
	$("#loading_img").css({ WebkitTransform: 'rotate(' + 0 + 'deg)'});
	$("#loading_img").attr("src", "../resources/go_circle.png");
	$("#loading_img").click(function() {
		switchScreen("game");
	});
	
	$(document).click(function() {
		hostClickCount++;
	});
	
	initiateGame();
}

var end_game_travel_dst = 150;
function initiateGame() {
	
	// Gets the host opponent's clicks per second
	setInterval(function() {
		updateOpponentClickRate();
		updateHostClickRate();
	}, 1000)
	
	// Set as a different interval update to make sphero update async
	setInterval(function() {
		spheroRollSpeed = hostClickRate - opponentClickRate;
	}, 500);
	
	var endGameInterval = setInterval(function() {
		if (opponentTotalClicks - hostTotalClicks > end_game_travel_dst) {
			clearInterval(endGameInterval);
			endGameOpponentWin();
		} else if (hostTotalClicks - opponentTotalClicks > end_game_travel_dst) {
			clearInterval(endGameInterval);
			endGameHostWin();
		}
	}, 50);
}

var opponentClickRate = 0;
var opponentTotalClicks = 0;
function updateOpponentClickRate() {
	checkOpponentClickRate();
	opponentTotalClicks += opponentTotalClicks;
}

var hostClickRate = 0;
var hostClickCount = 0;
var hostTotalClicks = 0;
function updateHostClickRate() {
	hostClickRate = hostClickCount;
	hostTotalClicks += hostClickCount;
	hostClickCount = 0;
}


function endGameHostWin () {
	// TODO: MAKE THE HOST WIN
	endGameUpdate(true);
	$("#tap_now").html("YOU</br>WON");
	setTimeout(function() {
		window.location.href = "../menu_page/menu.html";
	}, 3000);
}

function endGameOpponentWin () {
	// TODO: MAKE THE OPPONENT WIN
	endGameUpdate(false);
	$("#tap_now").html("YOU</br>LOST");
	setTimeout(function() {
		window.location.href = "../menu_page/menu.html";
	}, 3000);
}


// Database Connection to update opponent click rate
function checkOpponentClickRate() {
	var sql = require('mssql'); 
	
	var config = {
	    user: '{Your Database Username}',
	    password: '{Your Database Password}',
	    server: '{Your Database Server}',
	    database: 'Tap_Of_War',
	
	    options: {
	        encrypt: true // Use this if you're on Windows Azure
	    }
	}
	
	var connection = new sql.Connection(config, function(err) {
	    var request2 = new sql.Request(connection); // or: var request = connection.request();
		request2.query('SELECT * FROM Game_Table', function(err, recordset) {
			var playerID = parseInt(localStorage.getItem("player_id"));
			var gameInstance;
			
			for (var i = 0; i < recordset.length; i++) {
				if (recordset[i].ID == playerID) {
					gameInstance = recordset[i];
				}
			}
			
			if (recordset == null || gameInstance == null) {
				alert("Error connecting to the server.");
				alert("Exiting to meny, sorry :(");
				window.location.href = "../menu_page/menu.html";
			} else {
				if (gameInstance.Opponent_Clicks_Per_Second == 0){
					opponentClickRate = 0;
				} else {
					opponentClickRate = gameInstance.Opponent_Clicks_Per_Second;
				}
			}
	    });
	});
}

// Database Connection to tell opponent they have won or lost
function endGameUpdate(hostWon) {
	var sql = require('mssql'); 
	
	var config = {
	    user: '{Your Database Username}',
	    password: '{Your Database Password}',
	    server: '{Your Database Server}',
	    database: 'Tap_Of_War',
	
	    options: {
	        encrypt: true // Use this if you're on Windows Azure
	    }
	}
	
	var host_winner_sql = "UPDATE Game_Table SET PLayer_ID='winner' WHERE ID='" + localStorage.getItem("player_id") + "'";
	var host_loser_sql = "UPDATE Game_Table SET PLayer_ID='loser' WHERE ID='" + localStorage.getItem("player_id") + "'";
	
	var connection = new sql.Connection(config, function(err) {
	    var request2 = new sql.Request(connection);
		if (hostWon) {
			request2.query(host_winner_sql, function(err, recordset) {});
		} else {
			request2.query(host_loser_sql, function(err, recordset) {});
		}
	});
}
