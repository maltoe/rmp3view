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

var App = {
	pages:   null,
	current: 0
};

$(document).ready(function() {

	// Set up views.
	App.pages = $('.page');
  var frame = $('#frame');
  var framecontainer = $('#framecontainer');
  var slidesize = $(App.pages[0]).outerWidth(true);
  framecontainer.css('width', slidesize * App.pages.length + "px");

  // Slide to page index
  App.slideTo = function(index) {
    // Jump to index
    index = parseInt(index);
    if(App.pages[index]){
    	var center_offset = (frame.width() - slidesize) / 2;
	    framecontainer.css('left', index * slidesize * -1 + center_offset);
	    App.current = index;
    }
  };

	// Run init function.
	$(window).bind('load', function(){
		App.slideTo(App.current);
	});

  // Event handler.
  $("#recreate_overlay_show").click(function() {
		$( "#recreate_confirm" ).dialog({
			resizable: false,
			height: 210,
			width: 450,
			modal: true,
			buttons: {
				"Yep, I'm sure!": function() {
					$("#recreation_overlay").fadeIn();
					$(this).dialog("close");
					$.get("/recreate", function() {
						$("#recreation_overlay").fadeOut();
					});
				},
				Cancel: function() {
					$(this).dialog("close");
				}
			}
		});
	});

  App.pages.click(function() {
  	App.slideTo($(this).data("page"));
  });
});