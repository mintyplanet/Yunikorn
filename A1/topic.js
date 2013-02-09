/*Defining a Topic model
 */
function Topic(title, link) {
  this.title = title;
  this.link = link;
  this.comment = new Array();
  this.upvote = 0;
}

Topic.prototype = {
	
	//return the title of the topic
	getTitle: function (){
		return this.title;
	},

	// return the link 
	getLink: function(){
		return this.link;
	},

	//return a list of comments
	getComments: function(){
		return this.commentArray;
	},

	// return the number of upvote the comments of this topic received.
	getUpvote: function(){
		return this.upvote;
	},

	addComment: function(commentID){
		this.comment.push(commentID);
	},

	voteup: function(){
		this.upvote++;
	}
}

module.exports = Topic;