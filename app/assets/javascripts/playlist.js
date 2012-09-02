$(document).ready(function() {

	$.ajax({
		url: '/playlist',
		dataType: 'script'
	});
	
	$("#playlist_scrollpane").jScrollPane();
});

function playlist_update() {
	$("#playlist_scrollpane").data("jsp").reinitialise({"mouseWheelSpeed": 50});

	$('.playlist_item_tracks_item').bind('webkitAnimationEnd', function() {
		this.style.webkitAnimationName = '';
	});

	$('.playlist_item_tracks_item').bind('webkitAnimationEnd', function(){
    this.style.webkitAnimationName = '';
	});

	$('.playlist_item_tracks_item').click(function() {
		var trackid = $(this).data("trackid");
		var player = $("#player").get(0);
		player.setAttribute("src", "/tracks/" + trackid);
		player.play();
	  $(this).css('webkitAnimationName', 'playlist_item_tracks_activated');
	});
}