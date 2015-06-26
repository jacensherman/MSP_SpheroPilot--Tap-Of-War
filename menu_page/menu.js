initialize();

function initialize () {
	$("#host-match-btn").click(function () {
		window.location.href = "../host_game_page/host_game.html";
	});
	$("#join-match-btn").click(function () {
		window.location.href = "../join_game_page/join_game.html";
	});
	$("#how-to-btn").click(function () {
		window.location.href = "../how_to_page/how_to.html";
	});
}