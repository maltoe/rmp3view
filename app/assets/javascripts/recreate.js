$(document).ready(function() {
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
					call_recreate();
				},
				Cancel: function() {
					$(this).dialog("close");
				}
			}
		});
	});
});

function call_recreate() {
	$.ajax({
		url: "/recreate",
		dataType: "script"
	});
}