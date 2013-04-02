// DisplayNum is the number of tweet to display per page.
// offset is the tweets that are being shown. If offset = 0, then 0-9 are being shown, 10 then 10-19... etc.
// user dictionary maps userid to the user information.
var DisplayNum = 2,
	offset = 0,
	userDict = {},
	moreData = true,
	favs;

//load the local json file
$.ajax({
	dataType :"json",
	url: "favs.json",
	async: false,
	mimeType: "application/json",
	success: function(data){ 
		//console.log(data);
		favs = data; 
	} 
});

//console.log(favs);
/*
 * Display content based on offset value.
 */
function displayContent(){
	var tweet, li, user, entities;

	// loop thru the tweets and push them to the DOM
	for(var i = offset; i < offset + DisplayNum; i++){
		tweet = favs[i];
		
		if (typeof tweet == 'undefined'){
			moreData = false;
			message = '<li class="endOfTweet"> No More Tweets</li>';
			$('#feeds').append(message);
			break;
		}
		
		user = tweet.user;
		li = $('#tweet-template').clone();
		li.removeAttr('style').addClass('tweet');
		// manipulate its contents
		
		li.find('.userpic').attr('src', user.profile_image_url);
		li.find('.user').text(user.name);
		li.find('.username').text('@' + user.screen_name);
		li.find('.tweet_text').text(tweet.text);
		
		li.find('.tweet_details').click(tweet, populateTweetDialog);
		li.appendTo('#feeds');
		
		//map userID to user
		userDict[user.screen_name] = user;
	}
}

function populateTweetDialog(e) {
	var dialog = $("div#tweetDialog"),
		tweet = e.data,
		user = tweet.user,
		media = tweet.entities.media;
	
	dialog.find(".tweet-full-text").text(tweet.text);
	dialog.find(".date").text(tweet.created_at);
	dialog.find(".retweet-count").text(tweet.retweet_count);
	dialog.find(".expanded-image").attr('src', user.profile_image_url);

	if (typeof media != "undefined" && !$(".media")[0]){
		media.forEach(function(mediaJSON){
			imageAnchor = dialog.find(".media-details").clone();
			imageAnchor.click(mediaJSON, openPicDialog);
			image = imageAnchor.find(".media-template");
			image.removeAttr('style').removeClass("media-template").addClass("media")
			image.attr('src', mediaJSON.media_url);
			image.appendTo(dialog.find(".media-grid"));
		});
	}
}

function openPicDialog(e) {
	var dialog = $("div#mediaDialog"),
		image = e.data;
	dialog.find(".large-pic").attr('src', image.media_url);
}

/*
 * change the offset amount and display the updated content
 */
function nextPage(){
	if(moreData){
		offset += DisplayNum;
		removeContent();
		displayContent();
	}
}

/*
 * change the offset amount and display the updated content
 */
function prevPage(){
	if(offset != 0){
		//see if on last page, if so set moreData back to true
		if(!moreData){
			moreData = true;
			$('#feeds').remove('.endOfTweet');
		}

		offset -= DisplayNum;
		removeContent();
		displayContent();
	}
}

/*
 * remove current contents.
 */
 
function removeContent(){
	//$('#feeds').remove('.tweet');
	$('.tweet,.endOfTweet').remove(); // Kevin, the above line didn't work.
}

 /*
 *-----------------------------------------------------------------------------------------------------------
 * Events ---------------------------------------------------------------------------------------------------
 *-----------------------------------------------------------------------------------------------------------	
 */

 
 //called when the DOM is first loaded.
 $(document).ready(function(){
	displayContent();

	/* Make sure you bind events after the document has loaded. i.e. here */

	//called when next page or prev page is clicked
	$("#right-btn").click(function(){ 
		nextPage();
	});
	$("#left-btn").click(function(){
		prevPage();
	});

});
