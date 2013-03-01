//sqlite3 database
var sqlite3 = require('sqlite3').verbose();
//database is in memory for now for developing purpose
var db = new sqlite3.Database(':memory:');

/* creat tables with the following schema:
 * post(postID(Key), url, text, image, date)
 * tracking(hostName(Key), postid(Key & Foreign Key), Sequence(Key), count, time)
 */
db.run("CREATE TABLE IF NOT EXISTS post(postID int NOT NULL, url varchar(255) NOT NULL,\
	 text varchar(255), image varchar(255), date varchar(20) NOT NULL, PRIMARY KEY (postID))", 
	function(err, row) { (err)? console.log(err) : console.log("created table post");});

db.run("CREATE TABLE IF NOT EXISTS tracking(hostName varchar(255) NOT NULL, postID int \
	NOT NULL, sequence int NOT NULL, count int NOT NULL, time varchar(20), \
	PRIMARY KEY(hostName, postID, sequence), FOREIGN KEY (postID) REFERENCES post(postID))",
	function(err, row) { (err)? console.log(err) : console.log("created table tracking");});

/*
 * Handle insertion of each blog post for getBlog.
 */
exports.insertGetBlog = function(postID, url, text, image, date, baseHostName, sequence, count){
	db.serialize(function(){
		db.run("INSERT INTO post VALUES (?,?,?,?,?)", [postID, url, text, image, date], 
			function(err, row) { (err)? 
			console.log(err) : console.log("inserted " + postID + " into post");});

		db.run("INSERT INTO tracking VALUES (?,?,?,?)", [baseHostName, postID, sequence, count, date],
			function(err, row) { (err)? 
			console.log(err) : console.log("inserted " + postID + " into tracking");});
	});
}

/* 
 * check if the blog is already being tracked. Return true if it is, otherwise return false.
 */
exports.checkBlog = function(blogName){
	var exist;
	db.get("SELECT hostName FROM tracking WHERE hostName = ?", blogName, 
		function(err, row) { (err)? console.log(err) : console.log("CheckBlog sucessful");
			(row)? exist = true : exist = false;});
	return exist;
}

exports.showTables = function(){
	db.serialize(function(){
		db.each("SELECT * FROM post", 
			function(err, row) { (err)? console.log(err) : console.log("Showing table post");
				// need to go thru each row
				console.log(row);
		});

		db.each("SELECT * FROM tracking", 
			function(err, row) { (err)? console.log(err) : console.log("Showing table tracking");
				// need to go thru each row
				console.log(row);
		});
	});
}