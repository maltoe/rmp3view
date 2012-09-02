//= require jqcloud
//= require jquery.jscrollpane
//= require jquery.mousewheel

$(document).ready(function() {

	$.ajax({
		url: '/medialib/toptags',
		dataType: 'script'
	});

	$("#albumlist_scrollpane").jScrollPane();
	
});

function album_query_complete(data) {
	$("#albumlist").html(data);

	$(".album_item_add_button").click(function(e) {
		var albumid = $(this).data("albumid");
		var item = $(this).parent().parent().parent();

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
	$("#albumlist_scrollpane").data("jsp").reinitialise({"mouseWheelSpeed": 50});
}