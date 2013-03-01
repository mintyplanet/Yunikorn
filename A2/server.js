var express = require('express'),
	Tumblr = require('./tumblr'),
	util = require('util'),
	sql = require('./sql'),
	querystring = require('querystring'),
	app = express(),
	tumblr = new Tumblr('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69'); //OAuth Consumer Key

var PORT = 31335; //Yuki's assigned port

/* store liked post of blog into database
 * host - /blog
 * method type: Post
 * sends: blog
 * receive : {"status": 200, "msg":"ok"} 
 */
function storeBlog(req, res, args){
	var baseHostName = args["blog"];
	console.log( baseHostName);
	//checking to see if the blog is already being tracked
	sql.checkBlog(baseHostName, function(queryResult){
		if(queryResult != null){
			res.json({"status": 409,"msg": "Blog is already tracked"});
		}
	});

	//call helper function in tumblr.js to talk to tumblr API and get the data
	var tumReq = tumblr.liked(baseHostName, function(data){
		//parse thru the returned data and store into database
		for (var i = 0; i < data.length; i++){
			var currentPost= data[i],
				postID = currentPost["id"],
				url = currentPost["post_url"],
				text = currentPost["text"],
				image = currentPost["image_permalink"],
				date = currentPost["date"],
				count = currentPost["note_count"];

			//insert all post into the database for the first time
			sql.insertGetBlog(postID, url, text, image, date, baseHostName, 1, count);
		}
		sql.showTables();
		//set the blog to be updated in an hour
		setInterval(function(){
			updateBlog(baseHostName);
			util.log(baseHostName + " updated"); 
			}, 1000*10 );
		res.json({"status": 200,"msg": "OK"});
	});

	tumReq.on('error', function(e) {
		// Invoked if JSONP response was non-200
		console.log(e);
		res.json({"status":404, "msg": "host name not found"});
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

//update blog with new counts from tumblr API
function updateBlog(blogName){
	var tumReq = tumblr.liked(blogName, function(data){
		//parse thru the returned data and store into database
		data.forEach(function(post){
			var postID = post.id,
				url = post.post_url,
				text = post.text,
				date = post.date,
				image = post.image_permalink,
				count = post.note_count;
			sql.getPost(postID, function(queryResult) {
				if (queryResult){ //this post is already being tracked
					var sequence = queryResult["sequence"] + 1;
					sql.insertNewTrack(postID, Date(), blogName, sequence, count);
				} else {
					//insert new post into the database
					sql.insertGetBlog(postID, url, text, image, date, blogName, 1, count);
				}
			});
		});
	});

	tumReq.on('error', function(e) {
		// return error message to the log.
		console.log(e);
	});

	//set timer to call update blog in one hour
	setInterval(function(){
		updateBlog(blogName);
		util.log(blogName + " updated"); 
		}, 1000*60*60 );
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


/* Sit back, and listen to the beautiful sound of port */
app.listen(PORT);
console.log("Express server listening on http://127.0.0.1:"+PORT);
