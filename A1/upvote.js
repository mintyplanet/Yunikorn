$(document).ready(function(){
    $(document).on ('click', '.up', function(){
		var topId = $(this).closest('.topic').attr('id');
		var commId = $(this).closest('.comment').attr('id');
		
		$.ajax({
			url:"/topic/" + topId + "/comment/" + commId, 
			type:"PUT",
			success:function(result){
				alert("upvoted!");
				$("#"+commId).children(".comment_meta").children(".voteNum").html(result.commentUpvote);
				$("#"+topId).find(".topic_votes").html("| " + result.topicUpvote + " Votes");
			}
		}).fail(function() { alert("error"); });
    });
});
