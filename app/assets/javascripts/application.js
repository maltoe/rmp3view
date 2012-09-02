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

var App = {
	pages:   null,
  frame: null,
  framecontainer: null,
  slidesize: -1,
	current: -1,

  slideTo: function(index) {
    // Jump to index
    index = parseInt(index);
    if(index == this.current)
      return;

    if(this.pages[index]){
      var center_offset = (this.frame.width() - this.slidesize) / 2;
      this.framecontainer.css('left', index * this.slidesize * -1 + center_offset);
      this.current = index;
    }
  },

  slidePrev: function() {
    var target = this.current - 1;
    if(target >= 0)
      this.slideTo(target);
  },

  slideNext: function() {
    var target = this.current + 1;
    if(target < this.pages.length)
      this.slideTo(target);
  },

  init: function() {
    this.pages = $('.page');
    this.frame = $('#frame');
    this.framecontainer = $('#framecontainer');
    this.slidesize = $(this.pages[0]).outerWidth(true);
    this.framecontainer.css('width', this.slidesize * this.pages.length + "px");
  }
};

$(document).ready(function() {

	// Set up views.
  App.init();
  App.slideTo(0);

  // Event handler.
  $(document).keydown(function(evt) {

    var code = evt.keyCode;
    if(code == 39 || code == 34){
      App.slideNext();
    }
    else if(code == 37 || code == 33){
      App.slidePrev();
    }  
  });

  App.pages.click(function() {
  	App.slideTo($(this).data("page"));
  });
});
