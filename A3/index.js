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
	var tweet, li, user;

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
		li.removeAttr('style').removeClass('tweet-template').addClass('tweet');
		// manipulate its contents
		li.find('.userpic').attr('src', user.profile_image_url);
		li.find('.user').text(user.name);
		li.find('.username').text('@' + user.screen_name);
		li.find('.tweet_text').text(tweet.text);
		
			//console.log("doing something: " + li.closest('.tweet-full-text').get(0).innerHTML);
			//$(this).text(tweet.text);

		li.appendTo('#feeds');
		
		//map userID to user
		userDict[user.screen_name] = user;
	}
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
 * Add a popup with the user information
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
		//console.log('clicked');
	});
	$("#left-btn").click(function(){
		prevPage();
	});

	// Called when click on user name or profile picture; displays user information
	$(".userpic.ui-li-thumb, .user, .username").click(function(e){
		$("#Popupbox").dialog({
			 autoOpen: false,
			 modal: true,
			 draggable: true,
			 Title: "test"});
		$("#Popupbox").dialog("moveToTop");
		//e.stopPropagation(); // If click on user, don't show tweet information
	});


});
