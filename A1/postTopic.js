$(document).ready(function(){
	$("button.btn.btn-post").click(function(){
		$.post("/topic", {
					title:$(".topic_title_form").val(),
					link:$(".topic_link_form").val()
				}, function(data, status) {
					alert("success " + data.topicID);
					
					// Add a topic
					$("#testTop").clone().attr({
						id:data.topicID,
						style:"display: inline"}).appendTo("#copy-contain");
						
					// Change topic information
					$("#"+data.topicID).children("div.topic_head").children("h3").children("a").html(data.title);
				}).fail(function() { alert("error"); });
	});
});