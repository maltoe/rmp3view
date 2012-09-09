function Pages() {
	this.pages =   null;
  this.frame = null;
  this.framecontainer = null;
  this.slidesize = -1;
	this.current = -1;

  // Initialization.
  this.pages = $('.page');
  this.frame = $('#frame');
  this.framecontainer = $('#framecontainer');
  this.slidesize = $(this.pages[0]).outerWidth(true);
  this.framecontainer.css('width', this.slidesize * this.pages.length + "px");

  // Event handler.
  var self = this;
  $(document).keydown(function(evt) {
    var code = evt.keyCode;
    if(code == 39 /* || code == 34 */) { // RIGHT (PAGE DOWN)
      self.slide_next();
    }
    else if(code == 37 /* || code == 33 */) { // LEFT (PAGE UP)
      self.slide_prev();
    }  
  });

  this.pages.click(function() {
    self.slide_to($(this).data("page"));
  });

  this.slide_to(0);
};


Pages.prototype.slide_to = function(index) {
  index = parseInt(index);
  if(index == this.current)
    return;

  if(this.pages[index]){
    var center_offset = (this.frame.width() - this.slidesize) / 2;
    this.framecontainer.css('left', index * this.slidesize * -1 + center_offset);
    this.current = index;
  }
}

Pages.prototype.slide_prev = function() {
  var target = this.current - 1;
  if(target >= 0)
    this.slide_to(target);
}

Pages.prototype.slide_next = function() {
  var target = this.current + 1;
  if(target < this.pages.length)
    this.slide_to(target);
}