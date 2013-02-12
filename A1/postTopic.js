$(document).ready(function(){

	var topHTML = '<div class="topic"> \
      <div class="topic_head"> \
      	<h3> \
      	<a href="javascript:void(0)">';
		
	var topHTML2 = '</a> \
      	<span class="topic_url"><a href="javascript:void(0)"><small>(topic.url)</small></a></span> \
      	</h3> \
      </div> \
      <div class="topic_meta"><small>Post Info | <span class="num_comments"></span></small> \
		<div class="reply"> \
		<a href="javascript:void(0)"><small>reply</small></a> \
			<div class="reply_body"> \
				<textarea class="reply_form" rows="5"></textarea><br /> \
				<button class="btn btn-small" type="button">Submit</button> \
			</div> \
		</div> \
	  </div> \
	  <div class="reply"> \
			<div class="reply_body"> \
				<textarea class="reply_form" rows="5"></textarea><br /> \
				<button class="btn btn-small" type="button">Submit</button> \
			</div> \
	  </div> \
	  </div>'; 
	  
	$("button.btn.btn-post").click(function(){
		$.post("/topic", {
					title:$(".topic_title_form").val(),
					link:$(".topic_link_form").val()
				}, function(data, status) {
					alert("success " + data.topicID);
					$(".postTopic").after(topHTML + data.title + topHTML2);
				}).fail(function() { alert("error"); });
	});
});