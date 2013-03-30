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
	url: "favs.json",
	async: false,
	success: function(data){ 
		 favs = $.parseJSON(data); 
	} 
});

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
		li = $('#feeds li.tweet-template').clone();
		li.removeAttr('style').removeClass('tweet-template').addClass('tweet');
		// manipulate its contents
		li.find('.userpic').attr('src', user.profile_image_url);
		li.find('.user').text(user.name);
		li.find('.username').text('@' + user.screen_name);
		li.find('.tweet_text').text(tweet.text);
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
 * remove current contents.
 */
function removeContent(){
	$('#feeds').remove('.tweet');
}

/*
 *-----------------------------------------------------------------------------------------------------------
 * Events ---------------------------------------------------------------------------------------------------
 *-----------------------------------------------------------------------------------------------------------	
 */

 
 //called when the DOM is first loaded.
 $(document).ready(function(){
	init();
	displayContent();
});

//called when next page or prev page is clicked
$("#right-btn").click(function(){ 
	nextPage();
	console.log('clicked');
});
$("#left-btn").bind('click', function(){
	prevPage();
});

$(window).resize(function(){
	var width = $(window).width();
	var height = $(document).height();
	modHeight = height - 100;
	widthDiff = 700;
	if (width < widthDiff) {
		$("#main_content").width("95%");
		$(".narrowview").show();
		$(".wideview").hide();
	} else {
		$("#main_content").width("70%");
		$(".wideview").show();
		$(".narrowview").hide();
	}
	
	$("#main_content").height(modHeight);
});


function init(){
	var width = $(window).width();
	var height = $(document).height();
	modHeight = height - 100;
	widthDiff = 700;
	
	if (width < widthDiff) {
		$("#main_content").width("95%");
		$(".narrowview").show();
		$(".wideview").hide();		
	} else {
		$("#main_content").width("70%");
		$(".wideview").show();
		$(".narrowview").hide();
		$(".left_arrow").position({
			my: "right",
			at: "left",
			of: ".tweet_content"
		});
		$(".right_arrow").position({
			my: "left",
			at: "right",
			of: ".tweet_content"
		});
	}
	
	$("#main_content").height(modHeight);
}