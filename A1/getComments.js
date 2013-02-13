$(document).ready(function(){
var commentTemplate = $('#testCom');
function commentDiv(comment){
		var cmnt = commentTemplate.clone();
		cmnt.attr({id:comment.commentID, style:"display: inline"});
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

	$(document).on ('click', '.topic_head', function(){
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
	});
});

