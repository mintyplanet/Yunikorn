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
	var tweet, li, user, text;

	// loop thru the tweets and push them to the DOM
	for(var i = offset; i < offset + DisplayNum; i++){
		tweet = favs[i];
		
		//check if there is anymore tweets, if not break loop and set moreData to false.	
		if (typeof tweet == 'undefined'){
			moreData = false;
			message = '<li class="endOfTweet"> No More Tweets</li>';
			$('#feeds').append(message);
			break;
		}

		text = replaceEntities(tweet);
		user = tweet.user;
		li = $('#tweet-template').clone();
		li.removeAttr('style').addClass('tweet');
		// manipulate its contents
		
		li.find('.userpic').attr('src', user.profile_image_url);
		li.find('.user').text(user.name);
		li.find('.username').text('@' + user.screen_name);
		//console.log(tweet.text);
		li.find('.tweet_details').append('<p class="tweet_text">' + text +'</p>');

		li.find('.tweet_details').click(tweet, populateTweetDialog);
		li.find('.user_details').click(user, populateUserDialog);
		li.appendTo('#feeds');
		
		//map userID to user
		userDict[user.screen_name] = user;
	}
}



/*
 * return text string with all links entities replaced. 
 */
function replaceEntities(tweet){
	var urls = tweet.entities.urls,
		media = tweet.entities.media,
		text = tweet.text;

	text = replaceLinks(text, urls);
	text = replaceLinks(text, media);
	return text;
}

/*
 * return a text string with the links in entity removed.
 */
function replaceLinks(text,entity){
	var urlstr;
	//check if there are any url, if there are then turn them into hyperlinks
	if(typeof entity != 'undefined'){
		for(var i = 0; i < entity.length; i++){
			urlstr = entity[i].url;
			text = text.replace(urlstr, '<a href="' + urlstr + '">' + urlstr + '</a>');	
		}
	}
	return text;
}

//--------------------------------------------------------------------------------------------------
// pagination---------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

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

/*
 * handle the event that a tweet is clicked
 */
function populateTweetDialog(e) {
	var dialog = $("div#tweetDialog"),
		tweet = e.data,
		user = tweet.user,
		media = tweet.entities.media,
		text;
	
	// manipulate it's content
	text = replaceEntities(tweet);
	dialog.find(".date").text(tweet.created_at);
	dialog.find(".retweet-count").text(tweet.retweet_count);
	dialog.find(".expanded-image").attr('src', user.profile_image_url);

	// check if the text of a tweet is already appended, if not append it.
	if (!$(".tweet-full-text")[0]){
		$('<p class="tweet-full-text">' + text + '</p>').insertAfter(dialog.find(".expanded-image"));
	}

	// append image thumbnails
	dialog.find('.media-details').remove();
	if (typeof media != 'undefined'){
		media.forEach(function(mediaJSON){
			imageAnchor = dialog.find(".media-template").clone();
			imageAnchor.removeAttr('style').removeClass("media-template").addClass("media-details");
			imageAnchor.click(mediaJSON, openPicDialog); 
			image = imageAnchor.find(".media");
			image.attr('src', mediaJSON.media_url).appendTo(imageAnchor);
			imageAnchor.appendTo(dialog.find(".media-grid"));
		});
	}
}

/*
 * handle the click event on a user profile
 */
function populateUserDialog(e) {
	var dialog = $("div#userDialog"),
		user = e.data;

	//manipulate its contents
	dialog.find(".username").text(user.name);
	dialog.find(".expanded-image").attr('src', user.profile_image_url);
	dialog.find(".user_description").text(user.description);

	//check if the user_url is already appended, if not append it.
	if(!$(".user_url")[0]){
		console.log(user.url);
		$('<p class="user_url">website: <a href="' + user.url + '">' + user.url +'</a></p>')
		.insertAfter(dialog.find(".user_description"));
	}

	dialog.find(".user_location").text(user.location);
}

/*
 * handle the click event on a picture
 */
function openPicDialog(e) {
	var dialog = $("div#mediaDialog"),
		image = e.data,
		picture = dialog.find(".large-pic").attr('src', image.media_url);
}
