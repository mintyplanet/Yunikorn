$(document).ready(function(){
  $(document).on ('click', 'button.btn.btn-small.com', function(){
		
		var id = $(this).closest('.topic').attr('id');
		var body = $(this).siblings('.reply_form').val();
		
		$.post("/topic/" + id + "/comment", {
			topicID:id,
			body:body
			}, function(data, status) {
					
				// Add a comment
				$("#testCom").clone().attr({
					id:data.commentID,
					style:"display: inline"}).appendTo("#" + id);
						
				// Change comment information
				$("#"+data.commentID).find(".timeStamp").html(new Date(data.timestamp).toLocaleString());
				$("#"+data.commentID).find("#bodyText").html(data.body);
				
				// Increment comment number under post
				var curr_comm = parseInt($("#"+id).find(".num_comments").text(), 10) + 1;
				$("#"+id).find(".num_comments").html(curr_comm + " Comments");
				
			}).fail(function() { alert("error"); });
		$(this).parent('.reply_body').toggle();
  });
});
