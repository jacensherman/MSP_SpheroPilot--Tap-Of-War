initialize();

function initialize () {
	var connectingInterval = setInterval(function () {
		var connect_to_game = connect_to_db();
		if (connect_to_game) {
			clearInterval(connectingInterval);
			initiate_connection_db();
			$(document).click(function() {
				clickCount++;
			});
			// TODO: GO TO GAME START
		}
	}, 1000);
}

var clickCount = 0;
var clicksPerSecond = 0;
function game_update() {
	// Updates the click rate every second
	setInterval(function () {
		clicksPerSecond = clickCount;
		clickCount = 0;
	}, 1000);
	
	// Sends click rate to databse
	// Called seperately from above to ensure async
	setInterval(function () {
		update_click_rate_db();
	}, 1000);
}


function connect_to_db() {
	// Connecting to Azure SQL Database
	var sql = require('mssql'); 
	var host_id = localStorage.getItem("join_id");
	
	var config = {
	    user: '{Your Database Username}',
	    password: '{Your Database Password}',
	    server: '{Your Database Server}',
	    database: 'Tap_Of_War',
	
	    options: {
	        encrypt: true
	    }
	}
	
	var connection = new sql.Connection(config, function(err) {
	    var request = new sql.Request(connection);
		request.query('SELECT * FROM Game_Table', function(err, recordset) {
			for (var i = 0; i < recordset.length; i++) {
				if (recordset[i].ID == host_id) {
					return true;
				}
				return false;
			}
	    });
	});
}

function initiate_connection_db() {
	// Connecting to Azure SQL Database
	var sql = require('mssql'); 
	var host_id = localStorage.getItem("join_id");
	var my_id = localStorage.getItem("player_id");
	
	var config = {
	    user: '{Your Database Username}',
	    password: '{Your Database Password}',
	    server: '{Your Database Server}',
	    database: 'Tap_Of_War',
	
	    options: {
	        encrypt: true
	    }
	}
	
	var connection = new sql.Connection(config, function(err) {
	    var request = new sql.Request(connection);
		var sql = "UPDATE Game_Table SET Opponent_ID='" + my_id + "' WHERE ID='" + host_id + "'";
		request.query('SELECT * FROM Game_Table', function(err, recordset) {
			for (var i = 0; i < recordset.length; i++) {
				if (recordset[i].ID == host_id) {
					return true;
				}
				return false;
			}
	    });
	});
}

function update_click_rate_db() {
	// Connecting to Azure SQL Database
	var sql = require('mssql'); 
	var host_id = localStorage.getItem("join_id");
	var my_id = localStorage.getItem("player_id");
	
	var config = {
	    user: '{Your Database Username}',
	    password: '{Your Database Password}',
	    server: '{Your Database Server}',
	    database: 'Tap_Of_War',
	
	    options: {
	        encrypt: true
	    }
	}
	
	var connection = new sql.Connection(config, function(err) {
	    var request = new sql.Request(connection);
		var sql = "UPDATE Game_Table SET Opponent_Clicks_Per_Second=" + clicksPerSecond + " WHERE ID='" + host_id + "'";
		request.query('SELECT * FROM Game_Table', function(err, recordset) {
			for (var i = 0; i < recordset.length; i++) {
				if (recordset[i].ID == host_id) {
					return true;
				}
				return false;
			}
	    });
	});
}
