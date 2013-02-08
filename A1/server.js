var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var PORT = 8000;

MIME_TYPES = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.txt': 'text/plain'
	//TODO: add image mime types
};

function serveFile(filePath, response) {
	fs.exists(filePath, function(exists) {
	if (!exists) {
		console.log(filePath + " not found");
		response.writeHead(404);
		response.end('404!');
		return;
	}

	fs.readFile(filePath, function(error, content) {
		if (error) {
		response.writeHead(500);
		response.end();
		return;
		}

		var extension = path.extname(filePath);
		var mimeType = MIME_TYPES[extension];
		response.writeHead(200,
						 {'Content-Type': mimeType ? mimeType : 'text/html'});
		response.end(content, 'uft-8');
		console.log(filePath+", a "+mimeType+" has been served!");
	});
	});
}

function serveREST(response, method, urlParts){
	//console.log('accepted REST call '+urlParts.pathname);
	
	/*  3 types of REST calls
	/topic(GET for a list of topic,POST to post a new topic+link)
	/topic/nyannyannyan/comment(GET to grab all the comments to a topic,POST to reply to a topic or subcomment)
	/topic/nyannyannyan/comment/456(POST or PUT to upvote)
	*/
	
	var result;
	if        (result=new RegExp("^/topic/?$").exec(urlParts.pathname)){
		respondJSON(response, "topic");
		
	} else if (result=new RegExp("^/topic/(\\w+)/comment/?$").exec(urlParts.pathname)){
		var topicID = result[1];
		respondJSON(response, {topicID:topicID});
		
	} else if (result=new RegExp("^/topic/(\\w+)/comment/(\\w+)/?$").exec(urlParts.pathname)){
		var topicID = result[1],
			commentID = result[2];
		respondJSON(response, {topicID:topicID, commentID:commentID});
		
	} else {
		response.writeHead(404);
		response.end('bad REST request');
		console.log("bad REST request" + urlParts.pathname);
	}
}

//Just sends out a JSON.stringified object and also log to console for debugging
function respondJSON(response, obj){
	var stringy = JSON.stringify(obj);
	response.writeHead(200, {'Content-type': 'application/json'});
	response.end(stringy);
	console.log(stringy);
}

http.createServer(function(request, response) {
	console.log('<==['+request.method+'] '+request.url);
	var urlParts = url.parse(request.url, true),
		pathname = urlParts.pathname;
	//All REST calls 
	if (pathname.match(/\/topic/)) {
		serveREST(response, request.method, urlParts);
	} else {
		pathname = (pathname=='/') ? '/index.html' : pathname;
		serveFile('.'+pathname, response);
	}
}).listen(PORT);
console.log("server running on http://127.0.0.1:" + PORT + '/');

