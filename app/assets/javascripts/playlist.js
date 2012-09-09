//= require handlebars

function Playlist() {
	// Initialization.
	this.playlist = $("#playlist");
	this.scrollpane = $("#playlist_scrollpane");
	this.items = [];
	this.current_item = null;
	this.selected_item = null;
	this.qlist = [];

	var playlist_item_template_src   = $("#playlist_item_template").html();
	this.playlist_item_template = Handlebars.compile(playlist_item_template_src);
	
	this.scrollpane.jScrollPane();

	// Don't know why, but on load, reinitialisation does not happen
	// correctly.
	setTimeout(function() {
		self.reinitialise_scrollpane();
	}, 2000);

	var self = this;
	this.playlist.keydown(function(evt) {
    var code = evt.keyCode;
    if(code == 81) // Q
    	self.append_to_qlist();
    else if(code == 38) { // UP
    	self.move_selection(-1, 1);
    } else if(code == 33) { // PAGE UP
    	self.move_selection(-1, 10);
    } else if(code == 40) { // DOWN
    	self.move_selection(1, 1);
    } else if(code == 34) { // PAGE DOWN
    	self.move_selection(1, 10);
    } else if(code == 13) {  // RETURN
    	self.current_item = self.selected_item;
    	self.track_to_div(self.current_item).css('webkitAnimationName', 'playlist_item_tracks_activated');
    	self.play();
    }
  });

	$.ajax({
		url: '/playlist',
		dataType: 'script'
	});
}

Playlist.prototype.reinitialise_scrollpane = function() {
	this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});
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
				position: $(this).parent().parent().parent().get(0).dataset["position"]
			},
			dataType: 'script'
		});
	});

	tracks.click(function () {
		self.selected_item = self.div_to_track(this);
		$(".playlist_item_tracks_item_selected").removeClass("playlist_item_tracks_item_selected");
		$(this).addClass("playlist_item_tracks_item_selected");
	});

	tracks.dblclick(function() {
		self.current_item = self.div_to_track(this);
		$(this).css('webkitAnimationName', 'playlist_item_tracks_activated');
		self.play();
	});

	$(".playlist_item[data-position='" + item.position + "'] .playlist_item_album_thumbnail").load(function() {
		self.reinitialise_scrollpane();
	});
}

Playlist.prototype.div_to_track = function(div) {
	// TODO: This parent()parent()parent() can't be the true way.
	return {
		number: parseInt($(div).data("number")),
		cd: parseInt($(div).parent().data("cd")),
		position: parseInt($(div).parent().parent().parent().parent().get(0).dataset["position"])
	};
}

Playlist.prototype.track_to_div = function(track) {
	return $(".playlist_item[data-position='" + track.position + "']" +
		" .playlist_item_tracks_cd[data-cd='" + track.cd + "']" +
		" .playlist_item_tracks_item[data-number='" + track.number + "']");
}

Playlist.prototype.delete = function(position) {
	var self = this;
	$(".playlist_item[data-position='" + position + "']").fadeOut(function() {
		$(this).remove();

		// Update items.
		self.items.splice(position - 1, 1);

		// Update playlist positions with higher indices.
		$(".playlist_item").each(function(idx, item) {
			var pos = item.dataset["position"];
			if(pos > position)
				// Remember, we're bypassing jQuery since data() doesn't update the DOM attribute.
				item.dataset["position"] = pos - 1;
		});

		// Update qlist
		self.qlist = $.map(self.qlist, function(item, idx) {
			if(item.position == position)
				return null;
			else if(item.position > position)
				return {
					position: item.position - 1,
					cd: item.cd,
					number: item.number
				};
			else
				return item;
		});
		self.update_qlist_idxs();

		// Update selected_item
		if(self.selected_item != null) {
			if(self.selected_item.position == position)
				self.selected_item = null;
			else if(self.selected_item.position > position)
				self.selected_item.position -= 1;
		}

		// Update current_item.
		if(self.current_item != null) {
			if(self.current_item.position > position)
				self.current_item.position -= 1;
			else if(self.current_item.position == position) {
				// In this case, we want to stop playing the song and
				// advance to the next album, if there is one. Or
				// continue with the qlist, of course.
				self.current_item.number = 1;
				self.current_item.cd = 1;
				self.advance();
			}
		}
	});
}

Playlist.prototype.clear = function() {
	$("#playlist").html("");
	this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});
	this.items = [];
	this.current_item = null;
}

Playlist.prototype.play = function() {
	// Deactivate the currently playing song item.
	$(".playlist_item_tracks_item_playling").removeClass("playlist_item_tracks_item_playling");

	// Activate the new one.
	var ci = this.current_item;
	this.track_to_div(ci).addClass("playlist_item_tracks_item_playling");
	player.play(this.items[ci.position - 1].cds[ci.cd - 1].tracks[ci.number - 1].id);
}

Playlist.prototype.play_first = function() {
	this.current_item = this.find_first_track();
	this.play();
}

Playlist.prototype.advance = function() {
	// Stop if playlist has been cleared.
	if(this.items.length == 0) {
		player.stop();
		return;
	}

	// Play items on qlist.
	if(this.qlist.length > 0) {
		var ni = this.qlist.splice(0, 1)[0];
		this.track_to_div(ni).find(".playlist_item_tracks_item_qpos").html("");
		this.update_qlist_idxs();
		this.current_item = ni;
		this.play();
		return;
	}

	// Play first song first.
	if(this.current_item == null) {
		this.play_first();
		return;
	}

	// Play next song.
	var ni = this.find_next_track(this.current_item);
	if(ni == null) {
		player.stop();
	} else {
		this.current_item = ni;
		this.play();
	}
}

Playlist.prototype.find_first_track = function() {
	return {
		position: 1,
		cd: 1,
		number: 1
	};
}

Playlist.prototype.find_previous_track = function(pos) {
	// Previous song on cd?
	if(pos.number > 1) {
		return {
			position: pos.position,
			cd: pos.cd,
			number: pos.number - 1
		};
	}

	// Previous cd in album?
	if(pos.cd > 1) {
		return {
			position: pos.position,
			cd: pos.cd - 1,
			number: this.items[pos.position - 1].cds[pos.cd - 2].tracks.length
		};
	}

	// Previous album in playlist?
	if(pos.position > 1) {
		var npos = pos.position - 1;
		var ncd = this.items[npos - 1].cds.length;
		var nnum = this.items[npos - 1].cds[ncd - 1].tracks.length;
		return {
			position: npos,
			cd: ncd,
			number: nnum
		};
	}

	// Repeat backward.
	var npos = this.items.length;
	var ncd = this.items[npos - 1].cds.length;
	var nnum = this.items[npos - 1].cds[ncd - 1].tracks.length;	
	return {
		position: npos,
		cd: ncd,
		number: nnum
	};
}

Playlist.prototype.find_next_track = function(pos) {
	// CD has remaining songs?
	if(this.items[pos.position - 1].cds[pos.cd - 1].tracks.length > pos.number) {
		return {
			position: pos.position,
			cd: pos.cd,
			number: pos.number + 1
		};
	} 

	// Album has remaining cd?
	if(this.items[pos.position - 1].cds.length > pos.cd) {
		return {
			position: pos.position,
			cd: pos.cd + 1,
			number: 1
		};
	}

	// Playlist has remaining albums?
	if(this.items.length > pos.position) {
		return {
			position: pos.position + 1,
			cd: 1,
			number: 1
		};
	}

	// Repeat.
	return this.find_first_track();
}

Playlist.prototype.append_to_qlist = function() {
  var si = this.selected_item;
  if(si == null)
  	return;

  // Check whether qlist already contains si.
  for(idx in this.qlist) {
  	var item = this.qlist[idx];
  	if((item.position == si.position) && (item.cd = si.cd) && (item.number == si.number))
  		return;
  }

  // Append si.
  var qpos = this.qlist.length + 1;
  this.qlist.push(si);
  this.track_to_div(si).find(".playlist_item_tracks_item_qpos").html("(" + qpos + ")");
}

Playlist.prototype.update_qlist_idxs = function() {
	var self = this;
	$(this.qlist).each(function(idx, item) {
		self.track_to_div(item).find(".playlist_item_tracks_item_qpos").html("(" + (idx + 1) + ")");
	});
}

Playlist.prototype.move_selection = function(direction, offset) {
	var si = this.selected_item;
	if((si == null) || (this.items.length == 0))
		return;

	for(var i = 0; i < offset; i++) {
		if(direction > 0)
			si = this.find_next_track(si);
		else
			si = this.find_previous_track(si);

		// Due to the length check above, si cannot be null.
	}

	this.selected_item = si;
	$(".playlist_item_tracks_item_selected").removeClass("playlist_item_tracks_item_selected");
	var track = this.track_to_div(si);
	track.addClass("playlist_item_tracks_item_selected");

	// Update scrollpane.
	var track_top = track.position().top;
	var jsppane_top = $("#playlist_scrollpane .jspPane").position().top;
	var jsp_height = this.scrollpane.height();
	if(track_top + jsppane_top > 0.95 * jsp_height)
		this.scrollpane.data("jsp").scrollBy(0, 0.95 * jsp_height);
	else if(track_top + jsppane_top < 0)
		this.scrollpane.data("jsp").scrollBy(0, -0.95 * jsp_height);
}
