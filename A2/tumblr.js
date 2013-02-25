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
	var apikey = apikey;
	
	this.liked = function(blogname){
		var url = util.format("http://api.tumblr.com/v2/blog/%s/likes?api_key=%s&offset=%d", blogname, apikey);
		
		this.emit('fetchliked', url, 0, []);
		return this;
	};
	
	var _fetchliked = function(url, offset, accPosts){
		var self = this,
			urlOffsetted = util.format(url, offset);
		JSONrequest(urlOffsetted, function(data){
			// This takes care of JSONP status check
			if (data.meta.status != 200) {
				self.emit('error', data.meta);
				return;
			}
			
			var posts = data.response.liked_posts,
				count = data.response.liked_count;
			
			console.log("Currently at "+offset+"/"+count);
			accPosts.push(posts);
			/* Need this logic, because the (real) tumblr API will only
			 * fetch 20 topics at most in one call.
			 */
			if (offset < count){
				self.emit('fetchliked', url, offset+posts.length, accPosts);
			} else {
				var allPosts = [].concat.apply([], accPosts);
				// Just making sure we have the right number of posts
				console.log("count: "+count);
				console.log("all posts: "+allPosts.length);
				self.emit('done', allPosts);
			}
		});
	};
	
	this.on('fetchliked', _fetchliked);
}

// Tumblr class inherits emit and on methods from EventEmitter
util.inherits(Tumblr, EventEmitter);
module.exports = Tumblr;
