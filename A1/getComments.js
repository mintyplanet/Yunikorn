$(document).ready(function(){
	$(document).on ('click', '.topic_head', function(){
	
		var topId = $(this).closest('.topic').attr('id');
		
		// Get top level comments
		$.get("/topic/" + topId + "/comment", function(data, status) {
		
			// Iterate through comments
			$.each(data, function(i, comment) {
				$.each(comment, function(k, item) {
					$("#testCom").clone().attr({
						id:item.commentID,
						style:"display: inline"}).appendTo("#" + topId);
						
					// Change comment information
					$("#"+item.commentID).children("div.comment_meta").children("small").html(item.timestamp);
					$("#"+item.commentID).children("p").html(item.body);
					
					// Get nested comments
					$.each(item.comment, function(i1, item1) {
						$("#testCom").clone().attr({
							id:item1.commentID,
							style:"display: inline"}).appendTo("#" + item.commentID);

						// Change comment information
						$("#"+item1.commentID).children("div.comment_meta").children("small").html(item1.timestamp);
						$("#"+item1.commentID).children("p").html(item1.body);
						
						// Recurse -- BAH
					});
				});
			});
		}).fail(function() { alert("error"); });
	});
});