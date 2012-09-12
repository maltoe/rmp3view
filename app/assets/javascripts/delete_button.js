(function( $ ) {
  $.fn.delete_button = function() {
		var bottomtop = document.createElement("div");
		$(bottomtop).addClass("delete_button_bottomtop");
		this.append(bottomtop);

		var topbottom = document.createElement("div");
		$(topbottom).addClass("delete_button_topbottom");
		this.append(topbottom);

		this.addClass("delete_button");
  };
})( jQuery );
