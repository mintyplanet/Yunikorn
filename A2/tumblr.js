var http = require('http'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

/* GET JSON response from url and pass the parsed JSON object to the 
 * callback function */
function JSONrequest(url, callback) {
	var req = http.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk){data+=chunk; });
		res.on('end', function(){ callback(JSON.parse(data)); });
	});
	req.on('error', function(e) {
		util.error("Request for "+url+" failed with error: "+e.message);
	});
}

/* Tumblr API. Only capable of fetching liked posts */
// See testtumblr.js for usage example
var Tumblr = function(apikey) {
	var apikey = apikey,
		emitter = new EventEmitter;
	
	this.liked = function(blogname, callback){
		var url = util.format("http://api.tumblr.com/v2/blog/%s/likes?api_key=%s", blogname, apikey);
		JSONrequest(url, function(data) {
			// This takes care of JSONP status check
			if (data.meta.status != 200) {
				emitter.emit('error', data.meta);
				return;
			}
            
			var posts = data.response.liked_posts,
				count = data.response.liked_count;
			console.log(util.format("fetched %d posts", posts.length));
			callback(posts);
		});
		return emitter;
	};
}

module.exports = Tumblr;
