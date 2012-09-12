function Player() {
	this.audio = $("#player_audio").get(0);
	this.shown = false;

	// Register event handler.
	this.audio.addEventListener("ended", function() {
		playlist.advance();
	});
}

Player.prototype.play = function(trackid) {
	if(!this.shown) {
		var self = this;
		$("#player_audio").fadeIn(function() {
			self.shown = true;
		});
	}

	this.audio.setAttribute("src", "/tracks/" + trackid);
	this.audio.play();
}

Player.prototype.stop = function() {
	this.audio.setAttribute("src", "");
}