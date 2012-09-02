function Playlist() {
	this.update = function() {
		this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});

		$('.playlist_item_tracks_item').bind('webkitAnimationEnd', function() {
			this.style.webkitAnimationName = '';
		});

		$('.playlist_item_tracks_item').bind('webkitAnimationEnd', function(){
	    this.style.webkitAnimationName = '';
		});

		$('.playlist_item_tracks_item').click(function() {
			player.play($(this).data("trackid"));
		  $(this).css('webkitAnimationName', 'playlist_item_tracks_activated');
		});
	};

	// Initialization.
	this.playlist = $("#playlist");
	this.scrollpane = $("#playlist_scrollpane");
	this.current = -1;
	
	this.scrollpane.jScrollPane();

	$.ajax({
		url: '/playlist',
		dataType: 'script'
	});
}

Playlist.prototype.append = function(data) {
	this.playlist.append(data);
	this.update();
}
