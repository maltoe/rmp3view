function Player() {
	this.audio = $("#player_audio").get(0);

	// Register event handler.
	this.audio.addEventListener("ended", function() {
		playlist.advance();
	});
}

Player.prototype.play = function(albumid, trackid) {
	this.audio.setAttribute("src", "/tracks/" + trackid);
	this.audio.play();
}

Player.prototype.stop = function() {
	this.audio.setAttribute("src", "");
}