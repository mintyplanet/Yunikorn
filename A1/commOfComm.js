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
						
				// Change topic information
				$("#"+data.commentID).children("div.comment_meta").children("small").html(
				new Date(data.timestamp).toLocaleString());
				$("#"+data.commentID).children("p").html(data.body);
			}).fail(function() { alert("error"); });
  });
});

