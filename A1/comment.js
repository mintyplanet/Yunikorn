/*Defining a comment model
 */
function Comment(body){
	this.body = body;
	this.comment = new Array();
	this.upvote = 0;
	this.timestamp = new Date();
} 

Comment.prototype = {

	// return the body of the comment
	getBody : function(){
		return this.body;
	},

	// return an array of comments
	getComments : function(){
		return this.comment;
	},

	//return the upvote of the comment
	getupvote : function(){
		return this.upvote;
	},

	//increment the upvote by 1.
	voteup: function(){
		this.upvote++;
	},

	// return the timestamp
	getTimestamp: function(){
		return this.timestamp;
	},

	// add the commentID to the list of comments
	addComment: function(commentID){
		this.comment.push(commentID);
	}
}

module.exports = Comment;