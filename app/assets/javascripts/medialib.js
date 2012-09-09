//= require jqcloud
//= require jquery.jscrollpane
//= require jquery.mousewheel

function Medialib() {
	// Initialization.
	this.albumlist = $("#albumlist");
	this.scrollpane = $("#albumlist_scrollpane");

	this.scrollpane.jScrollPane();
	
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

Medialib.prototype.albumlist_update = function(data) {
	this.albumlist.html(data);

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