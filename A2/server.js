var express = require('express'),
	Tumblr = require('./tumblr'),
	util = require('util'),
	sql = require('./sql'),
	querystring = require('querystring'),
	app = express(),
	tumblr = new Tumblr('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69'); //OAuth Consumer Key

var PORT = 31335; //Yuki's assigned port
var HOUR = 1000*10; // in milliseconds.	Currently set to 10 seconds for productive debugging...

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
					res.json({"status": 200,"msg": "OK"});
					// Schedule the blog to run every hour
					setInterval(updateBlog, HOUR, blogname); //setInterval(callback, delay, [arg], [...])
				}
			});
		} else {
			res.json(409, {"status": 409,"msg": "Blog is already tracked"});
		}
	});
}

/*return the json of trends tracked by blog
 * host - /blog/{base-hostname}/trends
 * method type: get
 * sends: {limit:(optional), order:"Trending"| "Recent"}
 * receive: see csc309 webpage
 */
function getBlogTrends(req, res){
	//TODO: Well, basically everything
	
	// getting the parameters is already done.
	var order = req.query.order,
		limit = req.query.limit,
		blogname = req.params.blogname;
		
	if (order == "Trending"){
		// get the latest tracking info for every post liked by blog
		// for each post, compare latest tracking info to last hour's tracking info
		// return limit number of posts with highest like difference in the past hour
	}
	if (order == "Recent"){
		// get the most recent posts from post table up to limit
		// for each post get the most up to date tracking info from tracking table
	} else {
		res.json(409, {"status": 409, "msg": "Must order by Trending or Recent"});
	}
		
	res.json({"trending": [{"not-a-real-field":blogname}], "order": order, "limit": limit});
}

/*return the json of trends tracked by every blog.
 * host - /blog/trends
 * method type: get
 * sends: {limit:(optional), order:"Trending"| "Recent"}
 * receive: see csc309 webpage
 */
function getTrends(req, res){
	//TODO: Well, basically everything.
	var order = req.query.order,
		limit = req.query.limit;
	
	res.json({"trending": [], "order": order, "limit": limit});
}

//Create table if database is not set up, else restart tracking on previously tracked blogs. 
function serverStart(){
	sql.init(function(blogname){
		setInterval(updateBlog, HOUR, blogname);
		console.log("tracking " + blogname);
	});
}

//update blog with new counts from tumblr API
function updateBlog(blogname, callback){
	callback = callback ? callback : function(){};
	
	var tumReq = tumblr.liked(blogname, function(data){
		// fetching the liked posts was successful. ok to use callback now.
		callback();
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
					sql.createPostStat(postID, blogname, sequence, count);
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

// Simple logging middleware development
app.use(express.logger('dev'));

/* Routes */
app.post('/blog', handleBlogPost);
app.get('/blog/:blogname/trends', getBlogTrends);
app.get('/blogs/trends', getTrends);

serverStart();

/* Sit back, and listen to the beautiful sound of port */
app.listen(PORT);
console.log("Express server listening on http://127.0.0.1:"+PORT);
