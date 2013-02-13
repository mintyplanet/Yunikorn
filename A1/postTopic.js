$(document).ready(function(){
	$("button.btn.btn-post").click(function(){
		$.post("/topic", {
					title:$(".topic_title_form").val(),
					link:$(".topic_link_form").val()
				}, function(data, status) {
					
					// Add a topic
					$("#testTop").clone().attr({
						id:data.topicID,
						style:"display: inline"}).appendTo("#copy-contain");
						
					// Change topic information
					$("#"+data.topicID).children("div.topic_head").children("h3").children("a.topic_title").html(data.title);
					
					$("#"+data.topicID).children("div.topic_head").children("h3").children("span.topic_url").children("a").children("small").html(data.link);
					
					$("#"+data.topicID).find(".topic_url").children("a").attr("href", "http://" + data.link);
				}).fail(function() { alert("error"); });
	});
});