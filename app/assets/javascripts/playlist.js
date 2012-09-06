//= require handlebars
function Playlist() {
	// Initialization.
	this.items = [];
	this.playlist = $("#playlist");
	this.scrollpane = $("#playlist_scrollpane");
	this.position = -1;
	this.number = -1;

	var playlist_item_template_src   = $("#playlist_item_template").html();
	this.playlist_item_template = Handlebars.compile(playlist_item_template_src);
	
	this.scrollpane.jScrollPane();

	$.ajax({
		url: '/playlist',
		dataType: 'script'
	});
}

Playlist.prototype.append = function(item) {
	this.items.push(item);
	
	// Render handlebars template.
	var item_html = this.playlist_item_template(item);
	this.playlist.append(item_html);

	// Register event handlers.
	var self = this;
	var tracks = $(".playlist_item[data-position='" + item.position + "'] .playlist_item_tracks_item");
	tracks.bind('webkitAnimationEnd', function() {
		this.style.webkitAnimationName = '';
	});

	tracks.click(function() {
		self.number = $(this).data("number");
		self.position = $(this).parent().parent().parent().data("position");
		 $(this).css('webkitAnimationName', 'playlist_item_tracks_activated');
		 self.play();
	});

	this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});
}

Playlist.prototype.clear = function() {
	$("#playlist").html("");
	this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});
	this.items = [];
	this.position = -1;
	this.number = -1;
}

Playlist.prototype.play = function() {
	// Deactivate the currently playing song item.
	$(".playlist_item_tracks_item_playling").removeClass("playlist_item_tracks_item_playling");

	// Activate the new one.
	var item = $(".playlist_item[data-position='" + this.position + "']" +
		" .playlist_item_tracks_item[data-number='" + this.number + "']");
	item.addClass("playlist_item_tracks_item_playling");

	player.play(this.items[this.position - 1].tracks[this.number - 1].id);
}

Playlist.prototype.play_first = function() {
	this.position = 1;
	this.number = 1;
	this.play();
}

Playlist.prototype.advance = function() {
	// Stop if playlist has been cleared.
	if(this.items.length == 0)
		return;

	// Play first song first.
	if(this.position == -1) {
		this.play_first();
		return;
	}

	// Album has remaining songs?
	if(this.items[this.position - 1].tracks.length > this.number) {
		this.number += 1;
		this.play();
		return;
	} 

	// Has playlist more albums?
	if(this.items.length > this.position) {
		this.position += 1;
		this.number = 1;
		this.play();
		return;
	}

	// Repeat.
	this.play_first();
	return;
}