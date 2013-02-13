$(document).ready(function(){
    $(document).on ('click', '.up', function(){
		var topId = $(this).closest('.topic').attr('id');
		var commId = $(this).closest('.comment').attr('id');
		
		$.ajax({
			url:"/topic/" + topId + "/comment/" + commId, 
			type:"PUT",
			success:function(result){
				alert("upvoted!");
				$("#"+commId).find(".voteNum").html(result.upvote);
				$("#"+topId).find(".topic_votes").html("| " + result.upvote + " Votes");
			}
		}).fail(function() { alert("error"); });
    });
});
