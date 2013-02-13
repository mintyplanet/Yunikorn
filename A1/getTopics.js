$(document).ready(function(){
		$.get("/topic", function(data, status) {
		
			// Iterate through topics
			$.each(data, function(i, topic) {
				$.each(topic, function(i, item) {
					$("#testTop").clone().attr({
						id:item.topicID,
						style:"display: inline"}).appendTo("#copy-contain");
						
					// Change topic information
					$("#"+item.topicID).children("div.topic_head").children(".topic_title").children("a").html(item.title);
					$("#"+item.topicID).children("div.topic_head").children("h3").children("span").children("a").children("small").html(item.link);
				});
			});
		}).fail(function() { alert("error"); });
});