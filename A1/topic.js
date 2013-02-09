/*Defining a Topic model
 * to create a Topic variable: Object.create(topic, {Title: {value : "string"}, {Hyperlink:{"link"}}});
 * to set or change the variales: var topic = Object.create(topic);
 *												topic.Title = "sting";
 * to call the functions: var title = topic.getTitle()
 */
var topic = {
	//return the title of the topic
	getTitle: function (){
		return this.Title;
	}

	// return the link 
	getHyperlink: function(){
		return this.Hyperlink;
	}

	//return the generated ID
	getID: function(){
		return this.ID;
	}

	//return a list of comments
	getComments: function(){
		return this.commentArray;
	}

	// return the number of upvote the comments of this topic received.
	getUpvote: function(){
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

module.exports = topic;