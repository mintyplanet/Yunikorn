$(document).ready(function(){

	// toggles display of the child reply_body div of a reply div
	$(document).on('click', '.reply_button', function () {
		$(this).next('.reply_body').toggle();
	});

	// When inputting into the textbox, this stops it from hiding again
	$(document).on('click', '.reply', function (event) {
		event.stopPropagation();
	});

	// Not needed because don't have comment number
	/* // get number of comments in a thread
	$(window).on('load', function () {
		$('.topic').each(function (i) {
			var count = $(this).find('.comment').length;
			if (count == 1) {
				$(this).find('.num_comments').append(count + " Comment");
			} else {
				$(this).find('.num_comments').append(count + " Comments");
			}
		});
	}); */
});
