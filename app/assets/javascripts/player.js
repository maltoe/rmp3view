function Player() {
	this.audio = $("#player_audio").get(0);
	this.shown = false;

	// Register event handler.
	this.audio.addEventListener("ended", function() {
		playlist.advance();
	});
}

Player.prototype.play = function(albumid, trackid) {
	if(!this.shown) {
		var self = this;
		$("#player_audio").fadeIn(function() {
			self.shown = true;
		});
	}

	$("#info_cover").attr("src", "/covers/" + albumid);
	this.audio.setAttribute("src", "/tracks/" + trackid);
	this.audio.play();
}

Player.prototype.stop = function() {
	this.audio.setAttribute("src", "");
}