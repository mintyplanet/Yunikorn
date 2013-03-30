$(document).ready(function(){
	var width = $(window).width();
	var height = $(document).height();
	modHeight = height - 100;
	widthDiff = 700;
	
	if (width < widthDiff) {
		$("#main_content").width("95%");
		$(".narrowview").show();
		$(".wideview").hide();		
	} else {
		$("#main_content").width("70%");
		$(".wideview").show();
		$(".narrowview").hide();
		$(".left_arrow").position({
			my: "right",
			at: "left",
			of: ".tweet_content"
		});
		$(".right_arrow").position({
			my: "left",
			at: "right",
			of: ".tweet_content"
		});
	}
	
	$("#main_content").height(modHeight);
});


$(window).resize(function(){
	var width = $(window).width();
	var height = $(document).height();
	modHeight = height - 100;
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
	
	$("#main_content").height(modHeight);
});
