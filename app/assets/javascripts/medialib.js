//= require jqcloud
//= require jquery.jscrollpane
//= require jquery.mousewheel

$(document).ready(function() {
	$.get('/tags/toptags', function(data, status) {
		if(status != "success") {
			$("#tagcloud").html("Error while fetching toptags.");
		} else {
			var tags = $(data).map(function(idx, it) {
				// Scale down "albums I own" a little since it's meaningless.
				if(it.tag == "albums I own")
					it.number /= 10;

				return {
					text: it.tag,
					weight: it.number,
					handlers: {click: function() {
						$.get('/albums/searchByTag', { "tag": it.tag }, function(data, status) {
							album_query_complete(null, { statusText: status, responseText: data });
						});
					}}
				};
			});

			$("#tagcloud").jQCloud(tags);
		}
	});
	
	$("#search_artist").bind("ajax:complete", album_query_complete);
	$("#search_random").bind("ajax:complete", album_query_complete);

	console.log("SCROLLPANE");
	$("#albumlist_scrollpane").jScrollPane();
});

function album_query_complete(status, data) {
	if(data.statusText != "OK" && data.statusText != "success")
		$("#albumlist").html("Error while fetching albums.");
	else {
		albumlist_update(data.responseText);

		// Refresh jScrollPane.
		$("#albumlist_scrollpane").data("jsp").reinitialise({"mouseWheelSpeed": 40});
	}
}

function albumlist_update(data) {
	$("#albumlist").html(data);

	$(".album_item_add_button").click(function(e) {
		var albumid = $(this).data("albumid");

		$(this).parent().parent().parent().addClass("album_added");
		
		// Stop propagation, we don't want to show this now.
		e.stopPropagation();
	});
}
