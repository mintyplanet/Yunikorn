//sqlite3 database
var sqlite3 = require('sqlite3').verbose();
//database is in memory for now for developing purpose
var db = new sqlite3.Database(':memory:');//./dbLog
var util = require('util');

function logIfError(success){
	return function(err, row){
		(err) ? util.error(err) : success(row);
	};
}

/*
function unixTimestamp(time){
	return Math.round(time/1000);
}*/

/* creat tables with the following schema:
 * post(postID(Key), url, text, image, date, latest_increment)
 * tracking(hostName(Key), postid(Key), Sequence(Key), count, time, increment)
 */
exports.init = function(callback){
	db.serialize(function(){
		db.run("CREATE TABLE IF NOT EXISTS post(postID int NOT NULL, url varchar(255) NOT NULL,\
			text TEXT, image varchar(255), date int NOT NULL, latest_increment int NOT NULL, PRIMARY KEY (postID))", 
			logIfError(function(row) {console.log("created table posts");})
		);
	 
		db.run("CREATE TABLE IF NOT EXISTS tracking(hostName varchar(255) NOT NULL, postID int \
			NOT NULL, sequence int NOT NULL, count int NOT NULL, time int NOT NULL, increment int NOT NULL,\
			PRIMARY KEY(hostName, postID, sequence))",
			logIfError(function(row) {console.log("created table tracking");})
		);

		db.each("SELECT distinct hostName FROM tracking", 
			logIfError(function(row){
				callback(row.hostName);
			})
		);
	});
}
	
/*
 * Handle insertion of each blog post for getBlog.
 */
exports.registerBlog = function(postID, url, text, image, blogpubdate, blogname, count){
	db.serialize(function(){

		// latest_increment + increment initialized at 0
		db.run("INSERT INTO post VALUES (?,?,?,?,?,0)", [postID, url, text, image, Date.parse(blogpubdate)], 
			logIfError(function(row){ 
				console.log("inserted " + postID + " into post"); 
			})
		);

		db.run("INSERT INTO tracking VALUES (?,?,1,?,?,0)", [blogname, postID, count, new Date().getTime()],
			logIfError(function(row){
				//console.log("inserted " + postID + " into tracking"); 
			})
		);
	});
}

/* 
 * check if the blog is already being tracked. Return true if it is, otherwise return false.
 */
exports.BlogIsTracked = function(blogName, callback){
	db.get("SELECT hostName FROM tracking WHERE hostName = ?", blogName, 
		logIfError(function(row){
			//console.log("BlogIsTracked successful");
			callback(row);
		})
	);
}

exports.showTables = function(){
	db.serialize(function(){
		db.each("SELECT * FROM post", 
			logIfError(function(row){ console.log("Showing table post"); console.log(row); })
		);

		db.each("SELECT * FROM tracking", 
		logIfError(function(row){ console.log("Showing table tracking"); console.log(row); })
		);
	});
}

exports.getLatestPostStats = function(postID, callback, json){
	db.get("SELECT * FROM tracking WHERE postID = ? \
		AND sequence = (SELECT MAX(sequence) FROM tracking WHERE postID = ?)", [postID, postID],
		logIfError(function(row, json){
			//console.log("get latest post stats successful");
			if (json) {
				callback(row, json);
			} else {
				callback(row);
			}
		})
	);
}

exports.createPostStat = function(postID, blogname, sequence, count, latest_increment){

	// Post no longer static => Updates for latest_increment
	db.run("UPDATE post SET latest_increment = ? WHERE postID = ?", [latest_increment, postID], 
			logIfError(function(row){ 
				//console.log("updated " + postID + " into post with latest_increment " + latest_increment); 
			})
		);

	db.run("INSERT INTO tracking VALUES (?,?,?,?,?,?)", [blogname, postID, sequence, count, new Date().getTime(),
		latest_increment],
		logIfError(function(row){
			//console.log("inserted " + postID + " into tracking with increment " + latest_increment);
		})
	);
}


exports.getRecentPostsByBlog = function(blogname, limit, callback, json) {
	db.each("(SELECT * FROM post NATURAL JOIN \
		SELECT postID FROM tracking WHERE hostname = ?) ORDER BY date DESC \
		LIMIT ?", [blogname, limit],
		logIfError(function(row, json){
			callback(row, json);
		})
	);
}


exports.getTrendingPostsByBlog = function(blogname, limit, callback, json) {
	db.each("(SELECT * FROM post NATURAL JOIN \
		SELECT postID FROM tracking WHERE hostname = ?) ORDER BY latest_increment DESC \
		LIMIT ?", [blogname, limit],
		logIfError(function(row, json){
			callback(row, json);
		})
	);
}


exports.getPostStats = function(postID, callback, json) {
	db.each("(SELECT * FROM tracking WHERE postID = ?) ORDER BY sequence DESC",
		postID,
		logIfError(function(row, json){
			callback(row, json);
		})
	);
}


/* Gets the most recent posts in the database, limited by limit
 */
exports.getPosts = function(order, limit, callback) {

	// Recent = order by date, Trending = order by latest_increment
	if (order == "Recent")
	{
		db.all("SELECT * FROM post ORDER BY date DESC LIMIT ?", [limit],
			logIfError(function(rows){
				//rows.forEach(function (row) {
				//    console.log("Returned row: " + row.url + " and date: " + row.date
				//	+ " and inc: " + row.latest_increment);
				//});
				
				callback(rows);
			})
		);
	} 
	else if (order == "Trending")
	{
		db.all("SELECT * FROM post ORDER BY latest_increment DESC LIMIT ?", [limit],
			logIfError(function(rows){
				//rows.forEach(function (row) {
				//    console.log("Returned row: " + row.url + " and date: " + row.date
				//	+ " and inc: " + row.latest_increment);
				//});
				
				callback(rows);
			})
		);
	}
}


/* This function is the same as getPostStats but without the json callback. 
 * Will change it later to reduce redundancy; not sure how to user it properly atm ._.
 */
exports.getTrackingInfo = function(postID, limit, callback) {
	db.all("SELECT * FROM tracking WHERE postID = ? ORDER BY sequence DESC LIMIT ?", [postID, limit],
		logIfError(function(rows){
			callback(rows);
		})
	);
}

