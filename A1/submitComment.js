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
				$("#"+data.commentID).children("p").children("span").html(data.body);
			}).fail(function() { alert("error"); });
  });
});
