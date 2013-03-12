var http = require('http'),
	util = require('util');

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
var Tumblr = function(apikey) {
	var apikey = apikey;
	
	/* Returns an array of posts that blogname liked on Tumblr.
	 * callback(err, posts) is called when there is an error, or when
	 * the posts are retrieved. In the latter case, err is null.
	 */
	this.liked = function(blogname, callback){
		var url = util.format("http://api.tumblr.com/v2/blog/%s/likes?api_key=%s", blogname, apikey);
		JSONrequest(url, function(data) {
			// This takes care of JSONP status check
			if (data.meta.status != 200) {
				callback(data.meta, null);
				return;
			}
            
			var posts = data.response.liked_posts,
				count = data.response.liked_count;
			util.log(util.format("fetched %d (%d total) liked posts of %s", posts.length, count, blogname));
			callback(null, posts);
		});
	};
}

module.exports = Tumblr;
