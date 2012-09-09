function Pages(pagesize, pages) {
	this.pagesize = pagesize;
  this.pages = pages;
  this.current = -1;

  // Initialization.
  this.frame = $('#frame');
  this.framecontainer = $('#framecontainer');
  this.framecontainer.css('width', this.pagesize * this.pages.length + "px");

  // Event handler.
  var self = this;
  $(document).keydown(function(evt) {
    var code = evt.keyCode;
    if((code == 39 /* || code == 34 */) && // RIGHT (PAGE DOWN)
        evt.shiftKey) { 
      self.slide_next();
    }
    else if((code == 37 /* || code == 33 */) && // LEFT (PAGE UP)
        evt.shiftKey) { 
      self.slide_prev();
    }  
  });

  this.slide_to(0);
};


Pages.prototype.slide_to = function(index) {
  index = parseInt(index);
  if(index == this.current)
    return;

  if(this.pages[index]){
    var center_offset = (this.frame.width() - this.pagesize) / 2;
    this.framecontainer.css('left', index * this.pagesize * -1 + center_offset);
    this.current = index;
    this.pages[index].set_focus();
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