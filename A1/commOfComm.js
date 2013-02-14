$(document).ready(function(){
  $(document).on ('click', 'button.btn.btn-small.comCom', function(){
		var topId = $(this).closest('.topic').attr('id');
		var commId = $(this).closest('.comment').attr('id');
		var body = $(this).siblings('.reply_form').val();
		
		$.post("/topic/" + topId + "/comment/" + commId, {
			body:body
			}, function(data, status) {
					
				// Add a comment
				$("#testCom").clone().attr({
					id:data.commentID,
					style:"display: inline"}).appendTo("#" + commId);
						
				// Change comment information
				$("#"+data.commentID).find(".timeStamp").html(new Date(data.timestamp).toLocaleString());
				$("#"+data.commentID).find("#bodyText").html(data.body);
				
				// Increment comment number under post
				var curr_comm = parseInt($("#"+topId).find(".num_comments").text(), 10) + 1;
				$("#"+topId).find(".num_comments").html(curr_comm + " Comments");
				
			}).fail(function() { alert("error"); });
		$(this).parent('.reply_body').toggle();
  });
});

