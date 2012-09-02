function Player() {
	this.audio = $("#player_audio").get(0);
	this.current = 0;
}

Player.prototype.play = function(trackid) {
	this.audio.setAttribute("src", "/tracks/" + trackid);
	this.audio.play();
}
