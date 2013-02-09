/*Defining a comment model
 * to create a comment variable: Object.create(topic, {commentList: {value : list}, {commentBody:{value: "string"}}});
 * to set or change the variales: var comment = Object.create(comment);
 *												comment.ID = 10;
 * to call the functions: var commentID = comment.getID()
 */
var comment(){
	// return an array of comments
	getCommentsArray : function(){
		return this.commentsArray;
	}

	// return the body of the comment
	getCommentBody : function(){
		return this.commentBody;
	}

	// return commentID
	getID: function(){
		return this.ID;
	}

	//return the upvote of the comment
	getupvote : function(){
		return this.upvote;
	}

	//return the number of upvote its subcomments has
	getsubupvote: function(){
		var upvoteCount = 0;
		var comment;
		for (var i = 0; i < this.commentsArray.length; i++){
			comment = this.commentsArray[i];
			upvoteCount += comment.getupvote;
			upvoteCount += comment.getsubupvote; 
		}
		return upvoteCount;
	}
}

module.exports = comment;