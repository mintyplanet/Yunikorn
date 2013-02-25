var http = require('http'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

function JSONrequest(url, callback) {
	res = http.get(url, function(res) {
		console.log("Requested: "+url);
		console.log("Got response: "+res.statusCode);
		var data = "";
		res.on('data', function(chunk){ util.print('.'); data+=chunk; });
		res.on('end', function(){ util.put('.'); callback(data); });
	});
	res.on('error', function(e) {
		util.error("Request for "+url+" failed with error: "+e.message);
	});
}
	
var Tumblr = function(apikey) {
	var apikey = apikey;
	var track = new EventEmitter();
	
	return {
		likes: function (blogname, callback){
			var url = util.format("http://api.tumblr.com/v2/blog/%s/likes?api_key=%s", blogname, apikey);
			var topics = [];
			
			var topicResponse = JSONrequest();
			topicResponse.on('data', function(toc){topics+=toc;});
			topicResponse.on('end', function(){callback(topics);});
			
			
			//Get first 20 topics
			//if there is more, repeat
			
			//callback(topics)
			
			var url = util.format("http://api.tumblr.com/v2/blog/%s/likes?api_key=%s", blogname, apikey);
			JSONrequest(url, function(data){
				var response = JSON.parse(data)['response'],
					posts = response['liked_posts'],
					count = response['liked_count'];
				util.puts(posts.length);
				util.puts(count);
			});
			return track;
		}
	};
}
	
	
module.exports = Tumblr;
