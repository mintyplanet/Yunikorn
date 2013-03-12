var express = require('express'),
	Tumblr = require('./tumblr'),
	util = require('util'),
	sql = require('./sql'),
	async = require('async'),
	querystring = require('querystring'),
	app = express(),
	tumblr = new Tumblr('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69'); //OAuth Consumer Key

var PORT = 31335; //Yuki's assigned port
var HOUR = 1000*60*5; // in milliseconds.	Currently set to 10 seconds for productive debugging...


/*****************Registering and tracking blogs**********************/

// extract the data for the post request on path /blog
function handleBlogPost(req, res){
	var postBody = '';
	req.on('data', function(chunk) {
      	postBody += chunk.toString();
    });
    
    //extract the post data, and send the data to the right function
    req.on('end', function() {
    	storeBlog(req, res, querystring.parse(postBody));
    });
}

/* store liked post of blog into database
 * host - /blog
 * method type: Post
 * sends: blog
 * receive : {"status": 200, "msg":"ok"} 
 */
function storeBlog(req, res, args){
	var blogname = args["blog"];
	
	//checking to see if the blog is already being tracked
	sql.BlogIsTracked(blogname, function(queryResult){
		if(!queryResult){
			updateBlog(blogname, function(err){
				if (err) {	// JSONP response was non-200
					res.json(err.status, err);
				} else {
					res.json({"status": 200,"msg": "Blog is registered to be tracked"});
					// Schedule the blog to run every hour
					setInterval(updateBlog, HOUR, blogname);
				}
			});
		} else {
			res.json(409, {"status": 409,"msg": "Blog is already tracked"});
		}
	});
}

//update blog with new counts from tumblr API
function updateBlog(blogname, callback){
	
	var tumReq = tumblr.liked(blogname, function(data){
		// fetching the liked posts was successful. ok to use callback now.
		if (callback) callback();
		//parse thru the returned data and store into database
		data.forEach(function(post){
			var postID = post.id,
				url = post.post_url,
				text = post.text,
				date = post.date,
				image = post.image_permalink,
				count = post.note_count;
			sql.getLatestPostStats(postID, function(queryResult) {
				if (queryResult){ //this post is already being tracked
					var sequence = queryResult["sequence"] + 1;

					// Getting latest increment from database
					var latest_increment = post.note_count - queryResult["count"];
					sql.createPostStat(postID, blogname, sequence, count, latest_increment);
					
				} else {
					//insert new blog info into the database
					sql.registerBlog(postID, url, text, image, date, blogname, count);
				}
			});
		});
	});

	tumReq.on('error', function(e) {
		callback(e);
	});
}

/**********************Getting tracking info***************************/

/*return the json of trends tracked by every blog.
 * host - /blogs/trends
 * method type: get
 * sends: {limit:(optional), order:"Trending" | "Recent"}
 * receive: see csc309 webpage
 */
function getTrends(req, res){

	var order = req.query.order,
		limit = req.query.limit ? req.query.limit : 10; // default limit to 10 since optional

	// If order is a valid input, get the trends
	if (order == "Trending" || order == "Recent"){
		sql.getPosts(order, limit, function(posts) {
			getTrackingInfo(posts, function(trending) {
				res.json({"trending": trending, "order": order, "limit": limit});
			});
		});
	} else {
		res.json(409, {"status": 409, "msg": "Must order by Trending or Recent"});
	}
}

/*return the json of trends tracked by blog
 * host - /blog/{base-hostname}/trends
 * method type: get
 * sends: {limit:(optional), order:"Trending" | "Recent"}
 * receive: see csc309 webpage
 */ 

function getBlogTrends(req, res){
	var order = req.query.order,
		limit = req.query.limit ? req.query.limit : 10, // default limit to 10 since optional
		blogname = req.params.blogname;

	// If order is a valid input, get the trends
	if (order == "Trending" || order == "Recent"){
		sql.getPostsLikedBy(blogname, order, limit, function(posts) {
			getTrackingInfo(posts, function(trending) {
				res.json({"trending": trending, "order": order, "limit": limit});
			});
		});
	} else {
		res.json(409, {"status": 409, "msg": "Must order by Trending or Recent"});
	}
}

/*
 */
function getTrackingInfo(posts, callback) {
	async.map(posts, function(post, donePost) {
		sql.getTrackingInfo(post.postID, function(trackingInfo) {
			delete post.postID;
			if (!post.text) delete post.text;
			if (!post.image) delete post.image;
			
			var latest_tracking = trackingInfo[0];
			post.last_track = latest_tracking.timestamp;
			post.last_count = latest_tracking.count;
			post.tracking = trackingInfo;
			donePost(null, post);
		});
	}, function(err, posts) {
		callback(posts);
	});
}

/*******************Misc/Helper functions*****************************/

//Create table if database is not set up, else restart tracking on previously tracked blogs. 
function serverStart(){
	sql.init(function(blogname){
		setInterval(updateBlog, HOUR, blogname);
		console.log("tracking " + blogname);
	});
}
/***********************Starting the app*******************************/

// Simple logging middleware for development
app.use(express.logger('dev'));

/* Routes */
app.post('/blog', handleBlogPost);
app.get('/blog/:blogname/trends', getBlogTrends);
app.get('/blogs/trends', getTrends);

serverStart();

/* Sit back, and listen to the beautiful sound of port */
app.listen(PORT);
console.log("Express server listening on http://127.0.0.1:"+PORT);
