var tumblrAPI = require('./tumblr'),
	tumblr = tumblrAPI('EzNnvqdhs5XPSAAm7ioYyxXgyFQHlIDYtqYhifb3oi5fqkQl69');

var track = tumblr.likes('wilwheaton.tumblr.com', function( liked_posts ){
	console.log(liked_posts.length);
	//Save the posts to db
	});

track.on('error', function(e) {
	console.log('holy crap');
	});
