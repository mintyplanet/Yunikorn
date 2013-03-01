var express = require('express'),
	Tumblr = require('./tumblr'),
	util = require('util'),
	sql = require('./sql'),
	app = express(),
	tumblr = new Tumblr('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69');

/* 
 * OAuth Consumer Key: EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69
 */
var PORT = 31335; //Yuki's assigned port

/* store liked post of blog into database
 * host - /blog
 * method type: Post
 * sends: blog
 * receive : {"status": 200, "msg":"ok"} 
 */
function storeBlog(req, res){
	var baseHostName = req.params.blog;

	//checking to see if the blog is already being tracked
	if(sql.checkBlog(baseHostName)){
		res.json({"status": 409,"msg": "Blog is already tracked"});
	}
	
	//call helper function in tumblr.js to talk to tumblr API and get the data
	var tumReq = tumblr.liked(baseHostName);

	tumReq.on('done', function(data){
		console.log(data.length);
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
			sql.insertGetBlog(postID, url, text, image, date, baseHostName, postID, 1, count);
		}
		
		//set the blog to be updated in an hour
		setInterval(function(){
			updateBlog(baseHostName);
			util.log(hostName + " updated"); 
			}, 1000*60*60 );
		res.json({"status": 200,"msg": "OK"});
	});

	tumReq.on('error', function(e) {
		// Invoked if JSONP response was non-200
		console.log(e);
		res.json({"status":404, "msg": "tumblr did not repond"})
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
	//TODO: everything.
}

// Simple logging middleware development
app.use(express.logger('dev'));

/* Routes */
app.post('/blog', storeBlog);
app.get('/blog/:blogname/trends', getBlogTrends);
app.get('/blogs/trends', getTrends);

setInterval(function(){
	util.log('This is scheduled to run every 5 seconds');
}, 1000*5 );

setInterval(function(){
	util.log('And this one, every hour. Maybe we can use this to schedule the hourly tracking');
}, 1000*60*60 );

/* Sit back and listen to port */
app.listen(PORT);
console.log("Express server listening on http://127.0.0.1:"+PORT);
