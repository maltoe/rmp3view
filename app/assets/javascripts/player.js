function Player() {
	this.audio = $("#player_audio").get(0);

	// Register event handler.
	$("#next_button").click(function() {
		playlist.advance();
	});
}

Player.prototype.play = function(trackid) {
	this.audio.setAttribute("src", "/tracks/" + trackid);
	this.audio.play();
}
