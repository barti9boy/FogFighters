$(document).ready(function() {
	setInterval(function(){ //wykonujemy kod co 1500 milisekund
			$("#AvailablePlayers").load("DisplayPlayers.php");
	},1500);

	$("#AvailablePlayers").load("DisplayPlayers.php");

});