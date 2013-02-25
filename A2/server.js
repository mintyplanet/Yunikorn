var express = require('express'),
	Tumblr = require('./tumblr'),
	util = require('util'),
	app = express(),
	tumblr = new Tumblr('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69');

/* 
 * OAuth Consumer Key: EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69
 */
var PORT = 31335; //Yuki's assigned port

// Simple logging middleware for development
app.use(express.logger('dev'));


/* Routes */
app.post('/blog', function(req, res){
	//TODO: Get the base hostname as a parameter. Save it in the db for tracking.
	res.json({"status": 200,"msg": "OK"});
});
app.get('/blog/:blogname/trends', function(req, res) {
	//TODO: Well, basically everything
	
	// getting the parameters is already done.
	var order = req.query.order,
		limit = req.query.limit,
		blogname = req.params.blogname;
		
	res.json({"trending": [{"not-a-real-field":blogname}], "order": order, "limit": limit});
});
app.get('/blogs/trends', function(req, res) {
	//TODO: Well, basically everything.
	var order = req.query.order,
		limit = req.query.limit;
	res.json({"trending": [], "order": order, "limit": limit});
});

setInterval(function(){
	util.log('This is scheduled to run every 5 seconds');
}, 1000*5 );

setInterval(function(){
	util.log('And this one, every hour. Maybe we can use this to schedule the hourly tracking');
}, 1000*60*60 );

/* Sit back and listen to port */
app.listen(PORT);
console.log("Express server listening on http://127.0.0.1:"+PORT);
