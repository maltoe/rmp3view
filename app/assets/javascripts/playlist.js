//= require handlebars
function Playlist() {
	// Initialization.
	this.items = [];
	this.playlist = $("#playlist");
	this.scrollpane = $("#playlist_scrollpane");
	this.position = -1
	this.cd = -1;
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

	var delete_btn = $(".playlist_item[data-position='" + item.position + "'] .playlist_item_delete_button");
	delete_btn.click(function() {
		$.ajax({
			url: '/playlist/delete',
			data: { 
				position: $(this).parent().parent().parent().data("position")
			},
			dataType: 'script'
		});
	});

	tracks.dblclick(function() {
		self.number = $(this).data("number");
		// TODO: This can't be the true way.
		self.cd = $(this).parent().data("cd");
		self.position = $(this).parent().parent().parent().parent().get(0).getAttribute("data-position");
		$(this).css('webkitAnimationName', 'playlist_item_tracks_activated');
		self.play();
	});

	this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});
}

Playlist.prototype.delete = function(position) {
	var self = this;
	$(".playlist_item[data-position='" + position + "']").fadeOut(function() {
		$(this).remove();

		$(".playlist_item").each(function(idx, item) {
			var pos = item.getAttribute("data-position");
			if(pos > position)
				// Remember, we're bypassing jQuery since it doesn't update the DOM attribute.
				item.setAttribute("data-position", pos - 1);
		});

		self.items.splice(position - 1, 1);
		if(self.items.length == 0) {
			self.position = -1;
			self.cd = -1;
			self.number = -1;
			player.stop();
		} else {
			// Deleted album was playing?
			if(self.position == position) {
				// Set to beginning of new current album.
				self.cd = 1;
				self.number = 1;

				// Deleted album was the last album?
				if(self.position >= self.items.length) {
					self.position = 1;
				} 

				self.play(); 
				
			// Currently playing album has larger position?
			} else if(self.position > position) {
				self.position -= 1;
			}
		}
	});
}

Playlist.prototype.clear = function() {
	$("#playlist").html("");
	this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});
	this.items = [];
	this.position = -1;
	this.cd = -1;
	this.number = -1;
}

Playlist.prototype.play = function() {
	// Deactivate the currently playing song item.
	$(".playlist_item_tracks_item_playling").removeClass("playlist_item_tracks_item_playling");

	// Activate the new one.
	var item = $(".playlist_item[data-position='" + this.position + "']" +
		" .playlist_item_tracks_cd[data-cd='" + this.cd + "']" +
		" .playlist_item_tracks_item[data-number='" + this.number + "']");
	item.addClass("playlist_item_tracks_item_playling");
	player.play(this.items[this.position - 1].cds[this.cd - 1].tracks[this.number - 1].id);
}

Playlist.prototype.play_first = function() {
	this.position = 1;
	this.cd = 1;
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

	// CD has remaining songs?
	if(this.items[this.position - 1].cds[this.cd - 1].tracks.length > this.number) {
		this.number += 1;
		this.play();
		return;
	} 

	// Album has remaining cd?
	if(this.items[this.position - 1].cds.length > this.cd) {
		this.cd += 1;
		this.number = 1;
		this.play();
		return;
	}

	// Playlist has remaining albums?
	if(this.items.length > this.position) {
		this.position += 1;
		this.cd = 1;
		this.number = 1;
		this.play();
		return;
	}

	// Repeat.
	this.play_first();
	return;
}