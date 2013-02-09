/*Defining a comment model
 */
function Comment(body){
	this.body = body;
	this.comment = new Array();
	this.upvote = 0;
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

	voteup: function(){
		this.upvote++;
	},

	addComment: function(commentID){
		this.comment.push(commentID);
	}
}

module.exports = Comment;