var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require('querystring');
var topicObj = require('./topic.js');
var commentObj = require('./comment.js');

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
 	//console.log(topicDB);
 	for(topicID in topicDB){
 		topic = topicDB[topicID];
 		topic["topicID"] = topicID;
 		topiclist.push(topic);
 	}
 	topic = {};
 	topic["topic"] = topiclist;
 	respondJSON(response, topic);
 } 

/*
 *Helper function for get comment
 * given an commentID, return a string that represent itself and its subcomments.
 */
function getCommentsOfComment(commentID){
	var comment = commentDB[commentID];
	var subcommentlist = comment.getComments();
	delete comment["comment"];

	if (subcommentlist == []){
		return comment;
	} else{
		var commentlist = new Array();
		for (subcommentID in subcommentlist){
			commentlist.push(getCommentsOfComment(subcommentID));
		}
		comment["comment"] = commentlist;
		return comment;
	}
}

/*
 *get comments of a topic
 * host- /topic/someid/comment
 * method type: get
 * send:{}
 * recieve:{"comments": [{"body":"somestring","upvote":int, 
 * "comment":[{"body":"somestring",...},... ], "timestamp": "time"},...]} 
 */
 function getComments(response, topicID){
	var commentlist = new Array();
	if (topicID in topicDB){
		var topic = topicDB[topicID];
		for (commentID in topic.getComments()){
			commentlist.push(getCommentsOfComment(commentID));
		}
		var result = {};
		result["comments"] = commentlist;
		respondJSON(response, result);
	} else {
		respondJSON(response, {err: "Topic not found"});
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
function createTopic(response, args){
	var title = args["title"],
		link = args["link"],
		id = getNextID();
	var newtopic = new topicObj(title, link);
	topicDB[id] = newtopic;

	newtopic["topicID"] = id;
	respondJSON(response, newtopic);
}

/*
 *create a comment to a topic:
 * host-/topic/someid/comment
 * method type: post
 * send:{"topicID": "someid", "body": "somestring"}
 * receive: { "body": "somestring", "comment":["someid,..."], "upvote":int, 
 * "timestamp": "time", "commentID": "someid"}
 */
function createTopicReply(response, args, topicID){
	var body = args["body"],
 		id = getNextID();
 	var comment = new commentObj(body);
 	if (topicID in topicDB){
 		var topic = topicDB[topicID];
 		topic.addComment(id);
 		commentDB[id] = comment;

 		comment["commentID"] = id;
 		respondJSON(response, comment);
 	} else {
 		respondJSON(response, {err: "Topic not found"});
 	}	
 }

/*
 *create a comment to a comment:
 * host-/topic/someid/comment/someid
 * method type: post
 * send:{ "body": "somestring", "commentID": "someid"}
 * receive: { "body": "somestring", "comment":["someid",...], "upvote":int, 
 * "timestampe": "time", "commentID": "someid"}
 */
 function createCommentReply(response, args, commentID){
 	var body = args["body"],
 		id = getNextID();
 	var newcomment = new commentObj(body);
 	if (commentID in commentDB){
 		var comment = commentDB[commentID];
 		comment.addComment(id);
 		commentDB[id] = newcomment;

 		newcomment["commentID"] = id;
 		respondJSON(response, newcomment);
 	} else {
 		respondJSON(response, {err: "Comment not found"});
 	}
 }


 /*upvote a comment:
 * host-/topic/someid/comment/someid
 * method type: put
 * send: {}
 * receive: {}
 */
function voteup(response, topicID, commentID){
	if (topicID in topicDB){
		topicDB[topicID].voteup();
	} else {
		respondJSON(response, {err: "Topic not found"});
	}

	if (commentID in commentDB){
		commentDB[commentID].voteup();
	} else {
		respondJSON(response, {err: "Comment not found"});
	}
	respondJSON(response, {Success: 200});
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

function handlePostRequest(request, response, callback, ID){
	var postBody = '';
	request.on('data', function(chunk) {
      	postBody += chunk.toString();
    });
    
    request.on('end', function() {
    	//console.log(postBody);
    	if (callback == createTopic){
    		callback(response, querystring.parse(postBody));
    	} else {
    		callback(response, querystring.parse(postBody), ID);
    	}
    });
}

function serveREST(response, request, urlParts){
	//console.log('accepted REST call '+urlParts.pathname);
	
	/*  3 types of REST calls
	/topic(GET for a list of topic,POST to post a new topic+link)
	/topic/nyannyannyan/comment(GET to grab all the comments to a topic,POST to reply to a topic)
	/topic/nyannyannyan/comment/456(POST to reply to comment, PUT to upvote)
	*/
	var method = request.method;
	var result;

	console.log("[200] " + method + " to " + request.url);
	if (result=new RegExp("^/topic/?$").exec(urlParts.pathname)){
		if (method == "GET"){
			getTopics(response);
		} else { //post
			handlePostRequest(request, response, createTopic);
		}	
		
	} else if (result=new RegExp("^/topic/(\\w+)/comment/?$").exec(urlParts.pathname)){
		var topicID = result[1];
		if (method == "GET"){
			console.log(topicID);
			getComments(response, topicID);
		} else { //post
			handlePostRequest(request, response, createTopicReply, topicID);
		}

	} else if (result=new RegExp("^/topic/(\\w+)/comment/(\\w+)/?$").exec(urlParts.pathname)){
		var topicID = result[1],
			commentID = result[2];
		if (method == "PUT"){
			voteup(response, topicID, commentID);
		} else { //post
			handlePostRequest(request, response, createCommentReply, commentID);
		}
		
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
		serveREST(response, request, urlParts);
	} else {
		pathname = (pathname=='/') ? '/index.html' : pathname;
		serveFile('.'+pathname, response);
	}
}).listen(PORT);
console.log("server running on http://127.0.0.1:" + PORT + '/');
