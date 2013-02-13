var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require('querystring');
var topicObj = require('./topic.js');
var commentObj = require('./comment.js');

var PORT = 31335;
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
 	
 	//go through all the topic in the database and return them.
 	for(topicID in topicDB){
 		topic = topicDB[topicID];
 		topic["topicID"] = topicID;
 		topiclist.push(topic);
 	}
 	topic = {};
 	topic["topic"] = topiclist;
 	respondJSON(response, topic, 200);
 }

/*
 * return a copy of comment.
 */
function cloneComment(comment){
	var copy = {};
	copy['body'] = comment.getBody();
	copy['upvote'] = comment.getupvote();
	copy['timestamp'] = comment.getTimestamp();
	return copy;
}

/*
 *Helper function for get comment
 * given an commentID, return a string that represent itself and its subcomments.
 */
function getCommentsOfComment(commentID){
	var comment = commentDB[commentID],
		subcommentlist = comment.getComments(),
		commentlist = new Array();
	comment = cloneComment(comment);
	comment["commentID"] = commentID;
	
	
	// loop thru the list of subcomment and get the comment's data
	for (var i = 0; i < subcommentlist.length; i++){
		commentlist.push(getCommentsOfComment(subcommentlist[i]));
	}
	comment["comment"] = commentlist;
	return comment;
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
	if (topicID in topicDB){
		var commentlist = new Array(),
		 	topic = topicDB[topicID],
			listofcomment = topic.getComments();

		//loop thru all the comments and get the comment's data
		for (var i = 0; i < listofcomment.length; i++){
			commentlist.push(getCommentsOfComment(listofcomment[i]));
		}
		var result = {};
		result["comments"] = commentlist;
		respondJSON(response, result, 200);
	} else {
		respondJSON(response, {err: "Topic not found"}, 404);
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
		link = args["link"];
	if ((title && link) != null){
		var id = getNextID(),
			newtopic = new topicObj(title, link);
		topicDB[id] = newtopic;

		newtopic["topicID"] = id;
		respondJSON(response, newtopic, 201);
	} else {
		respondJSON(response, {err : "invalid input"}, 400)
	}
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
 	if (topicID in topicDB){
		var body = args["body"],
 			id = getNextID(),
 			comment = new commentObj(body),
 			topic = topicDB[topicID];

 		// add commentID topic
 		topic.addComment(id);
 		topic.updateCommentNum();
 		commentDB[id] = comment;
 		comment["commentID"] = id;
 		respondJSON(response, comment, 201);
 	} else {
 		respondJSON(response, {err: "Topic not found"}, 404);
 	}	
 }

/*
 *create a comment to a comment:
 * host-/topic/someid/comment/someid
 * method type: post
 * send:{ "body": "somestring"}
 * receive: { "body": "somestring", "comment":["someid",...], "upvote":int, 
 * "timestampe": "time", "commentID": "someid"}
 */
 function createCommentReply(response, args, topicID, commentID){
 	if (commentID in commentDB && topicID in topicDB){
 		var body = args["body"],
 			id = getNextID(),
 			newcomment = new commentObj(body),
 			comment = commentDB[commentID];
 			topic = topicDB[topicID];
 		
 		// add comment into ParentComment
 		topic.updateCommentNum();
 		comment.addComment(id);
 		commentDB[id] = newcomment;
 		newcomment["commentID"] = id;
 		respondJSON(response, newcomment, 201);
 	} else {
 		respondJSON(response, {err: "Comment not found"}, 404);
 	}
 }


 /*upvote a comment:
 * host-/topic/someid/comment/someid
 * method type: put
 * send: {}
 * receive: {"topicUpvote": int, "commentUpvote": int}
 */
function voteup(response, topicID, commentID){
	var respond = {};
	if (topicID in topicDB){
		// update the vote in the topic
		var topic = topicDB[topicID];
		var upvote = topic.voteup();
		respond["topicUpvote"] = upvote;
	} else {
		respondJSON(response, {err: "Topic not found"}, 404);
	}

	if (commentID in commentDB){
		// update the vote in the comment
		var comment = commentDB[commentID];
		upvote = comment.voteup();
		respond["commentUpvote"] = upvote;
	} else {
		respondJSON(response, {err: "Comment not found"}, 404);
	}

	//return the number of upvote in the topic.
	
	respondJSON(response, respond, 202);
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

function handlePostRequest(request, response, callback, topicID, commentID){
	var postBody = '';
	request.on('data', function(chunk) {
      	postBody += chunk.toString();
    });
    
    //extract the post data, and send the data to the right function
    request.on('end', function() {
    	if (callback == createTopic){
    		callback(response, querystring.parse(postBody));
    	} else if (callback == createTopicReply){
    		callback(response, querystring.parse(postBody), topicID);
    	} else {
    		callback(response, querystring.parse(postBody), topicID, commentID);
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

	//console.log("[200] " + method + " to " + request.url);
	if (result=new RegExp("^/topic/?$").exec(urlParts.pathname)){
		if (method == "GET"){
			getTopics(response);
		} else { //post
			handlePostRequest(request, response, createTopic);
		}	
		
	} else if (result=new RegExp("^/topic/(\\w+)/comment/?$").exec(urlParts.pathname)){
		var topicID = result[1];
		if (method == "GET"){
			getComments(response, topicID);
		} else { //post
			//doesn't need an ID parameter.
			handlePostRequest(request, response, createTopicReply, topicID);
		}

	} else if (result=new RegExp("^/topic/(\\w+)/comment/(\\w+)/?$").exec(urlParts.pathname)){
		var topicID = result[1],
			commentID = result[2];
		if (method == "PUT"){
			voteup(response, topicID, commentID);
		} else { //post
			handlePostRequest(request, response, createCommentReply, topicID, commentID);
		}
		
	} else {
		response.writeHead(404);
		response.end('bad REST request');
		console.log("bad REST request" + urlParts.pathname);
	}
}

//Just sends out a JSON.stringified object and also log to console for debugging
function respondJSON(response, obj, status){
	var stringy = JSON.stringify(obj);
	response.writeHead(status, {'Content-type': 'application/json'});
	response.end(stringy);
	console.log("==>"+stringy);
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
