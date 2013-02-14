$(document).ready(function(){
	// If click on the arrow next to the replies
    $(document).on ('click', '.up', function(){
		var topId = $(this).closest('.topic').attr('id');
		var commId = $(this).closest('.comment').attr('id');
		
		// Send a put back the the backend
		$.ajax({
			url:"/topic/" + topId + "/comment/" + commId, 
			type:"PUT",
			success:function(result){
				// Change the vote information based on the backend response
				$("#"+commId).children(".comment_meta").children(".voteNum").html(result.commentUpvote);
				$("#"+topId).find(".topic_votes").html("| " + result.topicUpvote + " Votes");
			}
		}).fail(function() { alert("error"); });
    });
});
