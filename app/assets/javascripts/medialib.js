//= require jqcloud
//= require jquery.jscrollpane
//= require jquery.mousewheel

function Medialib() {
	// Initialization.
	this.albumlist = $("#albumlist");
	this.scrollpane = $("#albumlist_scrollpane");
	this.items = null;
	this.selected_item = null;

	var albumlist_template_src   = $("#albumlist_template").html();
	this.albumlist_template = Handlebars.compile(albumlist_template_src);

	this.scrollpane.jScrollPane({
		enableKeyboardNavigation: false
	});
	
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

	// Load toptags.
	$.ajax({
		url: '/medialib/toptags',
		dataType: 'script'
	});
}

Medialib.prototype.set_focus = function() {
	// TODO
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

	// Refresh jScrollPane.
	this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});
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
	var nsi = {
		colid: this.selected_item.colid + xoffset,
		rowid: this.selected_item.rowid + yoffset
	};

	if((nsi.colid >= 0) &&
		 (nsi.colid <= 3) &&
		 (nsi.rowid >= 0) &&
		 (nsi.rowid < this.items.rows.length)) {
		this.selected_item = nsi;
		this.selection_update();
	}

	// Scroll around.
	var itemtd = this.item_to_td(this.selected_item);
	var item_top = itemtd.position().top;
	var item_height = itemtd.height();
	var jsppane_top = this.scrollpane.find(".jspPane").position().top;
	var jsp_height = this.scrollpane.height();
	if(item_top + jsppane_top > 0.95 * jsp_height)
		this.scrollpane.data("jsp").scrollBy(0, 0.95 * jsp_height);
	else if(item_top + jsppane_top < 0)
		this.scrollpane.data("jsp").scrollBy(0, -0.95 * jsp_height + item_height);
}
