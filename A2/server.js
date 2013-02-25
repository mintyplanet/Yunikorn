var express = require('express'),
	tumblrAPI = require('./tumblr'),
	app = express(),
	tumblr = tumblrAPI('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69');

/* 
 * OAuth Consumer Key: EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69
 */
var PORT = 31335; //Yuki's assigned port

// Simple logging middleware for development
app.use(express.logger('dev'));


/* Routes */
app.post('/blog', function(req, res){
	res.json(tumblr);
});
app.get('/blog/:blogname/trends', function(req, res) {
	var order = req.query.order,
		limit = req.query.limit,
		blogname = req.params.blogname;
		
	res.json({"trending": [{"not-a-real-field":blogname}], "order": order, "limit": limit});
});
app.get('/blogs/trends', function(req, res) {
	var order = req.query.order,
		limit = req.query.limit;
	res.json({"trending": [], "order": order, "limit": limit});
});

/* Sit back and listen to port */
app.listen(PORT);
console.log("Express server listening on http://127.0.0.1:"+PORT);
