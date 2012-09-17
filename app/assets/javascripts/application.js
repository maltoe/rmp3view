// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ui.dialog
//= require_tree .
//= require handlebars

var player = null;
var playlist = null;
var medialib = null;
var controls_shown = 0;

function scroll_around(elem) {
	var elem_outerheight = elem.outerHeight();
	var elem_top = elem.position().top;
	var window_top = window.scrollY;
	var window_innerheight = window.innerHeight;
	if(elem_top + elem_outerheight > window_top + window_innerheight)
		window.scrollTo(0, elem_top);
	else if(elem_top < window_top)
		window.scrollTo(0, elem_top - window_innerheight + elem_outerheight);
}

function update_controls() {
	var pc = $("#playlist_container");
	var pc_h = pc.outerHeight();
	var pc_t = pc.position().top;
	var mc = $("#medialib_container");
	var mc_h = mc.outerHeight();
	var mc_t = mc.position().top;
	var wt = window.scrollY;
	var wh = window.innerHeight;

	// Calculate visible heights.
	var pc_vh = (((pc_t + pc_h) < (wt + wh)) ? (pc_t + pc_h) : (wt + wh)) -
							((pc_t > wt) ? pc_t : wt);
	var mc_vh = (((mc_t + mc_h) < (wt + wh)) ? (mc_t + mc_h) : (wt + wh)) -
							((mc_t > wt) ? mc_t : wt);

	if(pc_vh > mc_vh && controls_shown == 1) {
		controls_shown = 0;
		$("#playlist_controls").fadeIn();
		$("#medialib_controls").fadeOut();
	} else if(pc_vh < mc_vh && controls_shown == 0) {
		controls_shown = 1;
		$("#playlist_controls").fadeOut();
		$("#medialib_controls").fadeIn();
	}
}

function call_recreate() {
	$.ajax({
		url: "/recreate",
		dataType: "script"
	});
}

$(document).ready(function() {

	// Initialization.
  player = new Player();
  playlist = new Playlist();
  medialib = new Medialib();

  // Register onscroll handler to change controls in footer.
  window.onscroll = update_controls;

});
