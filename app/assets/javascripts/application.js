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
//= require recreate
//= require handlebars

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

var player = null;
var info = null;
var playlist = null;
var medialib = null;

$(document).ready(function() {

	// Initialization.
  player = new Player();
  info = new Info();
  playlist = new Playlist();
  medialib = new Medialib();

});
