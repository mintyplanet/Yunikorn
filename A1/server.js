var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var topic = require('./topic.js');
var comment = require('./comment.js');

var PORT = 8000;
var IDIterator = 100000000000;
var topicDB = {};
var commentDB = {};

MIME_TYPES = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.txt': 'text/plain'
	//TODO: add image mime types
};

//generate and return an ID
function getNextID(){
	var ID = IDIterator.toString(36);
	IDIterator++;
	return ID;
}

/*
 *get topics
 * host- /topic
 * method type: get
 * send:{}
 * receive: {"topic":[{"title":"somestring", "link":"somestring", "upvote": int, 
 * "timestamp": "time", topicID": ID}, ...]}
 */
 function getTopics(response){
 	var topiclist = new Array();
 	var topic;
 	for(topicID in topicDB){
 		var topic = topicDB[topicID];
 		topic["topicID"] = topicID;
 		topiclist.push(result);
 	}
 	topic = {};
 	topic["topic"] = topiclist;
 	respondJSON(response, topic);
 } 

/*
 *get comments of a topic
 * host- /topic/someid/comment
 * method type: get
 * send:{}
 * recieve:{"comments": [{"body":"somestring","upvote":int, 
 * "comment":[{"body":"somestring",...},... ], "timestamp": "time"},...]} 
 */
function getComments(response, ID){
	// is a topic
	if (ID in topicDB){
		var commentlist = new Array();
		for (commentID in topicDB[ID].getComments()){
			commentlist.push(getComments(response, commentID));
		}
		var result = {};
		result["comments"] = commentlist;
		responseJSON(response, result);
	//is a comment
	} else{
		var comment = commentDB[ID];
		var subcommentlist = comment.getComments();
		delete comment["comment"];

		if (subcommentlist == []){
			return comment;
		} else{
			var commentlist = new Array();
			for (subcommentID in subcommentlist){
				commentlist.push(getComments(response, subcommentID));
			}
			comment["comment"] = commentlist;
			return comment;
		}
	}
}

/* 
 *create a topic:
 * host- /topic
 * method type: post
 * send: {"title" : "somestring", "link" : "somestring"}
 * receive: {"title": "somestring", "link": "somestring", "comments": ["someid",...], 
 * "upvote": int, timestamp": "time", "topicID": "someid"}
 */
function createTopic(response, title, link){
	var id = getNextID();
	var newtopic = new topic(title, link);
	topicDB[id] = newtopic;

	newtopic["topicID"] = id;
	responseJSON(response, newtopic);
}

/*
 *create a comment to a topic:
 * host-/topic/someid/comment
 * method type: post
 * send:{"topicID": "someid", "body": "somestring"}
 * receive: { "body": "somestring", "comment":["someid,..."], "upvote":int, 
 * "timestamp": "time", "commentID": "someid"}
 */
 function createTopicReply(response, topicID, body){
 	var id = getNextID();
 	var comment = new comment(body);
 	topicDB[topicID].addComment(id);
 	commentDB[id] = comment;

 	comment["commentID"] = id;
 	responseJSON(response, comment);
 }

/*
 *create a comment to a comment:
 * host-/topic/someid/comment/someid
 * method type: post
 * send:{ "body": "somestring", "commentID": "someid"}
 * receive: { "body": "somestring", "comment":["someid",...], "upvote":int, 
 * "timestampe": "time", "commentID": "someid"}
 */
 function createCommentReply(response, commentID, body){
 	var id = getNextID();
 	var newcomment = new comment(body);
 	commentDB[commentID].addComment(id);
 	commentDB[id] = newcomment;

 	newcomment["commentID"] = id;
 	responseJSON(response, newcomment);

 }

/*
 *upvote a comment:
 * host-/topic/someid/comment/someid
 * method type: put
 * send: {}
 * receive: {}
 */
function voteup(response, topicID, commentID){
	topicDB[topicID].voteup();
	commentDB[commentID].voteup();
}

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
	/topic/nyannyannyan/comment(GET to grab all the comments to a topic,POST to reply to a topic)
	/topic/nyannyannyan/comment/456(POST to reply to comment, PUT to upvote)
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

