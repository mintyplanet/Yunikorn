$(document).ready(function(){
	
	var commentTemplate = $('#testCom');
	var shown = false;

	function toggleComm(topic, shown)
	{
		topic.siblings('.comment').toggle();
		topic.siblings('.comment').find('.comment').toggle();
	
		return !shown;
	}


	function commentDiv(comment){
		var cmnt = commentTemplate.clone();
		cmnt.attr({id:comment.commentID, style:"display: inline"});
		// if the comment is already there do not proceed, else grab the comment.
		if ($("#"+ comment.commentID + ".comment").length != 0){
			return "";
		}

		cmnt.find('.timestamp').html(new Date(comment.timestamp).toLocaleString());
		cmnt.find("#bodyText").html(comment.body);
		cmnt.children(".comment_meta").children(".voteNum").html(comment.upvote); // MUST keep this as children (can't use find) or it will screw up child comment votes
		$.each(comment.comment, function(i, nested) {
			cmnt.append(commentDiv(nested));
			//commentDiv(nested).appendTo(cmnt);
		});
		//console.log(cmnt.html());
		return cmnt;
	}
	
	// If click the submit button and not currently showing comments, show them
	$(document).on('click', 'button.btn-small.com', function () {
		var top = $(this).closest('.topic').find(".topic_head");
		
		if (!shown)
		{
			shown = toggleComm(top, shown);
		}
	});

	//if the title is clicked
	$(document).on ('click', '.topic_head', function(){
		//only retrieve comments if the comments are not shown
		if (!shown){
			var topId = $(this).closest('.topic').attr('id');
			// Get top level comments
			$.getJSON("/topic/" + topId + "/comment", function(data, status) {
				var topicComments = data["comments"];

				//console.log(topicComments);	
				$.each(topicComments, function(i, comment){
					//console.log(comment);
					var comments = commentDiv(comment);
					//console.log(topId);
					//comments.appendTo("#" + topId);
					$("#"+topId).append(comments);
				});
			});
		}
		shown = toggleComm($(this), shown);
	});
});
