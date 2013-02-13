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
			topID.find(".topic_url").children("a").attr("href", "http://" + sorted[i].link);
			// Get comments + hide for now
			getComments(sorted[i].topicID);
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

var commentTemplate = $('#testCom');
function commentDiv(comment){
	var cmnt = commentTemplate.clone();
	cmnt.attr({id:comment.commentID, style:"display: inline"});
	cmnt.find('.timeStamp').html(new Date(comment.timestamp).toLocaleString());
	cmnt.find("#bodyText").html(comment.body);
	cmnt.children(".comment_meta").children(".voteNum").html(comment.upvote); // MUST keep this as children (can't use find) or it will screw up child comment votes
	$.each(comment.comment, function(i, nested) {
		cmnt.append(commentDiv(nested));
		//commentDiv(nested).appendTo(cmnt);
	});
	//console.log(cmnt.html());
	cmnt.hide();
	return cmnt;
}

function getComments(topId)
{
	$.getJSON("/topic/" + topId + "/comment", function(data, status) {
		var topicComments = data["comments"];
		
		//console.log(topicComments);
		$.each(topicComments, function(i, comment){
			//console.log(comment);
			var comments = commentDiv(comment);
			//console.log(topId);
			//comments.appendTo("#" + topId);
			$("#"+topId).append(comments);
		});
	});
}
