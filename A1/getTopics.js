$(document).ready(function(){
	$.get("/topic", function(data, status) {
	
	var sorted = new Array();
	// Iterate through topics
	$.each(data, function(i, topic) {
		$.each(topic, function(i, item) {
			sorted.push(item);
		});
	});
	
	// Sort the list
	sortList(sorted);

	// Add in each item	
	for (var i=0; i < sorted.length; i++)
	{
		$("#testTop").clone().attr({
			id:sorted[i].topicID,
			style:"display: inline"}).appendTo("#copy-contain");
			
		// Change topic information
		var topID = $("#"+sorted[i].topicID);
		
		topID.children("div.topic_head").children("h3").children("a.topic_title").html(sorted[i].title);
		topID.children("div.topic_head").children("h3").children("span.topic_url").children("a").children("small").html(sorted[i].link);
		topID.find(".topic_votes").html("| " + sorted[i].upvote + " Votes");
	}
	}).fail(function() { alert("error"); });
});

function sortList (list)
{
	list.sort(function(a,b)
	{
		return parseInt(b.upvote) - parseInt(a.upvote);
	});
}
