$(document).ready(function() {

	$.ajax({
		url: '/playlist',
		dataType: 'script'
	});
	
	$("#playlist_scrollpane").jScrollPane();

});

function playlist_update() {
	$("#playlist_scrollpane").data("jsp").reinitialise({"mouseWheelSpeed": 50});
}