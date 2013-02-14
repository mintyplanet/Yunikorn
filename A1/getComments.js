$(document).ready(function(){
	
	var commentTemplate = $('#testCom');
	var shown = false;
	var NoData = true;

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

		cmnt.find('.timeStamp').html(new Date(comment.timestamp).toLocaleString());
		cmnt.find("#bodyText").html(comment.body);
		cmnt.children(".comment_meta").children(".voteNum").html(comment.upvote); // MUST keep this as children (can't use find) or it will screw up child comment votes
		
		// Sort nested comments
		sortList(comment.comment);
	
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
			//grab data for the first time.
			if (NoData){
				var topId = $(this).closest('.topic').attr('id');
				// Get top level comments
				$.getJSON("/topic/" + topId + "/comment", function(data, status) {
					var topicComments = data["comments"];

					// Sort nested comments
					sortList(topicComments);
	
					//console.log(topicComments);	
					$.each(topicComments, function(i, comment){
						//console.log(comment);
						var comments = commentDiv(comment);
						//console.log(topId);
						//comments.appendTo("#" + topId);
						$("#"+topId).append(comments);
					});
				});
				NoData = false;
			}
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

				// Sort nested comments
				sortList(topicComments);
	
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
	
	function sortList (list)
	{
		list.sort(function(a,b)
		{
			return parseInt(b.upvote) - parseInt(a.upvote);
		});
	}

});

