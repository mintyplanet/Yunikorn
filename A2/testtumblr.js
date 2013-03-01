var Tumblr = require('./tumblr'),
	tumblr = new Tumblr('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69'),
	_ = require('underscore');


var req = tumblr.liked('wilwheaton.tumblr.com', function(data){
	console.log("------topics--------");
	_(data).each(function(topic){
		console.log(topic.blog_name);
	});
});

req.on('error', function(e) {
	// Invoked if JSONP response was non-200
	console.log(e);
});
