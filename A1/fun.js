// toggles display of the child reply_body div of a reply div
$('.reply').on('click', function () {
	$(this).children('.reply_body').toggle();
});

$('.reply_body').on('click', function (event) {
	event.stopPropagation();
});

// get number of comments in a thread
$(window).on('load', function () {
	$('.topic').each(function (i) {
		var count = $(this).find('.comment').length;
		if (count == 1) {
			$(this).find('.num_comments').append(count + " Comment");
		} else {
			$(this).find('.num_comments').append(count + " Comments");
		}
	});
});