$(document).ready(function(){
	var shown = false;

	// If click the submit button and not currently showing comments, show them
	$(document).on('click', 'button.btn-small.com', function () {
		var top = $(this).closest('.topic').find(".topic_head");
		
		if (!shown)
		{
			shown = toggleComm(top, shown);
		}
	});
	
	// If click the topic head, show rest of the comments
	$(document).on('click', '.topic_head', function () {
		shown = toggleComm($(this), shown);
	});
}); 

function toggleComm(topic, shown)
{
	topic.siblings('.comment').toggle();
	topic.siblings('.comment').find('.comment').toggle();
	
	return !shown;
}