var Tumblr = require('./tumblr'),
	tumblr = new Tumblr('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69');


var req = tumblr.liked('wilwheaton.tumblr.com');
req.on('done', function(data){
	console.log(data.length);
});
req.on('error', function(e) {
	// Invoked if JSONP response was non-200
	console.log(e);
});