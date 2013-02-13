$(document).ready(function(){
	$(document).on('click', '.topic_head', function () {
		$(this).siblings('.comment').toggle();
		$(this).siblings('.comment').find('.comment').toggle();
	});
}); 