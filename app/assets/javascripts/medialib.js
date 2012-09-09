//= require jqcloud
//= require jquery.jscrollpane
//= require jquery.mousewheel

function Medialib() {
	// Initialization.

	this.albumlist = $("#albumlist");
	this.scrollpane = $("#albumlist_scrollpane");
	this.items = null;

	var albumlist_template_src   = $("#albumlist_template").html();
	this.albumlist_template = Handlebars.compile(albumlist_template_src);

	this.scrollpane.jScrollPane();
	
	// Event handlers.

	$(".letterbar_letter").click(function() {
		$.ajax({
			url: '/medialib/search',
			data: { letter: $(this).data("letter") },
			dataType: 'script'
		});
	});

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
	var items_html = this.albumlist_template(items);
	this.albumlist.html(items_html);

	$(".album_item_thumbnail").click(function(e) {
		var albumid = $(this).data("albumid");
		var item = $(this).parent().parent();

		$.ajax({
			url: '/playlist/add',
			data: { 'albumid': albumid },
			dataType: 'script',
			success: function() {
				item.addClass("album_added");
			}
		});	
	});

	// Refresh jScrollPane.
	this.scrollpane.data("jsp").reinitialise({"mouseWheelSpeed": 50});
}