initialize();

function initialize () {
	$("#host-match-btn").click(function () {
		if ($("#player-number").html() != "Loading") {
			window.location.href = "../host_game_page/host_game.html";
		} else {
			alert("Please wait until your player number has loaded.")
		}
	});
	$("#join-match-btn").click(function () {
		if ($("#player-number").html() != "Loading") {
			window.location.href = "../join_game_page/join_game.html";
		} else {
			alert("Please wait until your player number has loaded.")
		}
	});
	$("#how-to-btn").click(function () {
		window.location.href = "../how_to_page/how_to.html";
	});
	
	connect_to_db();
}

function connect_to_db() {
	// Connecting to Azure SQL Database
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
	    var request1 = new sql.Request(connection); // or: var request = connection.request();
		var dateTime = new Date().toUTCString();
	    request1.query("INSERT INTO Game_Table (Player_ID, Opponent_ID, Opponent_Clicks_Per_Second, Last_Update) VALUES ('-', '-', 0, '" + dateTime + "')", function(err, recordset) {
	        console.dir(recordset);
			console.dir(err);
	    });
	
	
	    var request2 = new sql.Request(connection); // or: var request = connection.request();
		request2.query('SELECT * FROM Game_Table', function(err, recordset) {
			
			var player_id = recordset[recordset.length - 1].ID.toString();
			localStorage.setItem("player_id", player_id);
			console.dir(player_id);
			$("#player-number").html(player_id);
	    });
	});
}
