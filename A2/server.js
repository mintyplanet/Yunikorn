var express = require('express'),
	Tumblr = require('./tumblr'),
	util = require('util'),
	app = express(),
	tumblr = new Tumblr('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69');

//sqlite3 database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

/* 
 * OAuth Consumer Key: EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69
 */
var PORT = 31335; //Yuki's assigned port

//store liked post of blog into database
function storeBlog(req, res){
	//TODO: Get the base hostname as a parameter. Save it in the db for tracking.
	var baseHostName = req.params.blog,
		tumReq = tumblr.liked(baseHostName);

	req.on('done', function(data){
		console.log(data.length);
		//parse thru the returned data and store into database

	});
	req.on('error', function(e) {
		// Invoked if JSONP response was non-200
		console.log(e);
	});

	res.json({"status": 200,"msg": "OK"});
}

//return the json of trends tracked by blog
function getBlogTrends(req, res){
	//TODO: Well, basically everything
	
	// getting the parameters is already done.
	var order = req.query.order,
		limit = req.query.limit,
		blogname = req.params.blogname;
		
	res.json({"trending": [{"not-a-real-field":blogname}], "order": order, "limit": limit});
}

//return the json of trends tracked by every blog.
function getTrends(){
	//TODO: Well, basically everything.
	var order = req.query.order,
		limit = req.query.limit;
	
	res.json({"trending": [], "order": order, "limit": limit});
}

//update blog with new counts from tumblr API
function updateBlog(){
	//TODO: everything.
}

// Simple logging middleware development
app.use(express.logger('dev'));

/* Routes */
app.post('/blog', storeBlog(req, res));
app.get('/blog/:blogname/trends', getBlogTrends(req, res));
app.get('/blogs/trends', getTrends(req, res));

setInterval(function(){
	util.log('This is scheduled to run every 5 seconds');
}, 1000*5 );

setInterval(function(){
	util.log('And this one, every hour. Maybe we can use this to schedule the hourly tracking');
}, 1000*60*60 );

/* Sit back and listen to port */
app.listen(PORT);
console.log("Express server listening on http://127.0.0.1:"+PORT);
