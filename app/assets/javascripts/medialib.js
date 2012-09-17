//= require jqcloud

function Medialib() {
	// Initialization.
	this.albumlist = $("#albumlist");
	this.items = null;
	this.selected_item = null;

	var albumlist_template_src   = $("#albumlist_template").html();
	this.albumlist_template = Handlebars.compile(albumlist_template_src);

	// Event handlers.

	$(".letterbar_letter").click(function() {
		$.ajax({
			url: '/medialib/search',
			data: { letter: $(this).data("letter") },
			dataType: 'script'
		});
	});

	var self = this;
	this.albumlist.keydown(function(evt) {
		evt.preventDefault();

    var code = evt.keyCode;
    if(code == 37) { // LEFT
    	self.move_selection(-1, 0);
    } else if(code == 38) { // UP
    	self.move_selection(0, -1);
    } else if(code == 39) { // RIGHT
    	self.move_selection(1, 0);
    } else if(code == 40) { // DOWN
    	self.move_selection(0, 1);
    } else if(code == 13) {  // RETURN
    	if(self.selected_item != null)
    		self.add_to_playlist(self.selected_item);
    }
  });

  $("#random_button").click(function() {
  	$.ajax({
  		url: '/medialib/random?limit=50',
  		dataType: 'script'
  	});
  });

  $("#search_input").keydown(function(evt) {
  	if(evt.keyCode == 13) {
  		$.ajax({
  			url: '/medialib/search',
  			data: { keyword: $(this).val() },
  			dataType: 'script'
  		});
  		return false;
  	}
  });

  $("#recreate_button").click(function() {
		$( "#recreate_confirm" ).dialog({
			resizable: false,
			height: 210,
			width: 450,
			modal: true,
			buttons: {
				"Yep, I'm sure!": function() {
					$("#recreation_overlay").fadeIn();
					$(this).dialog("close");
					call_recreate();
				},
				Cancel: function() {
					$(this).dialog("close");
				}
			}
		});
	});

  this.albumlist.focus(function() {
  	self.move_selection(0, 0);
  });

	// Load toptags.
	$.ajax({
		url: '/medialib/toptags',
		dataType: 'script'
	});
}

Medialib.prototype.set_focus = function() {
	this.albumlist.focus();
}

Medialib.prototype.albumlist_update = function(items) {
	this.items = items;
	this.albumlist.html(this.albumlist_template(this.items));

	var self = this;
	$(".album_item").dblclick(function(e) {
		var item = self.td_to_item(this);
		self.add_to_playlist(item);
	});

	$(".album_item").click(function(e) {
		self.selected_item = self.td_to_item(this);
		self.selection_update();
	});
}

Medialib.prototype.selection_update = function() {
	$(".album_item_selected").removeClass("album_item_selected");
	this.item_to_td(this.selected_item).addClass("album_item_selected");
}

Medialib.prototype.add_to_playlist = function(item) {
	var self = this;
	$.ajax({
		url: '/playlist/add',
		data: { 'albumid': self.items.rows[item.rowid].albums[item.colid].id },
		dataType: 'script',
		success: function() {
			self.item_to_td(item).addClass("album_added");
		}
	});	
}

Medialib.prototype.td_to_item = function(td) {
	return {
		colid: $(td).data("colid"),
		rowid: $(td).parent().data("rowid")
	};
}

Medialib.prototype.item_to_td = function(item) {
	return $(".albumlist_row[data-rowid='" + item.rowid + "']" +
	  " .album_item[data-colid='" + item.colid + "']");
}

Medialib.prototype.move_selection = function(xoffset, yoffset) {
	if(this.items == null)
		return;

	var nsi;
	if(this.selected_item == null) {
		nsi = {
			colid: 0,
			rowid: 0
		};
	} else {
		nsi = {
			colid: this.selected_item.colid + xoffset,
			rowid: this.selected_item.rowid + yoffset
		};
	}

	if((nsi.rowid >= 0) &&
		(nsi.rowid < this.items.rows.length) &&
		(nsi.colid >= 0) &&
		(nsi.colid < this.items.rows[nsi.rowid].albums.length)) {
		// Move selection.
		this.selected_item = nsi;
		this.selection_update();

		// Scroll around.
		scroll_around(this.item_to_td(nsi));
	}
}
