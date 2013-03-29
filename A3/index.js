$(document).load(function(){
	var width = $(window).width();
	widthDiff = 700;
	if (width < widthDiff) {
		$("#main_content").width("95%");
		$(".narrowview").show();
		$(".wideview").hide();
	} else {
		$("#main_content").width("70%").addClass("wideview");
		$(".wideview").show();
		$(".narrowview").hide();
	}
});


$(window).resize(function(){
	var width = $(window).width();
	widthDiff = 700;
	if (width < widthDiff) {
		$("#main_content").width("95%");
		$(".narrowview").show();
		$(".wideview").hide();
	} else {
		$("#main_content").width("70%");
		$(".wideview").show();
		$(".narrowview").hide();
	}
});
