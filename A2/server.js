var express = require('express'),
	app = express();

var PORT = 31335; //Yuki's assigned port
 
// Simple logging middleware for development
app.use(express.logger('dev'));


/* Routes */
app.post('/blog', function(req, res){
	res.json();
});
app.get('/blog/:base_hostname/trends', function(req, res) {
	var order = req.query.order,
		limit = req.query.limit,
		hostname = req.params.base_hostname;
		
	res.json({"trending": [{"not-a-real-field":hostname}], "order": order, "limit": limit});
});
app.get('/blogs/trends', function(req, res) {
	var order = req.query.order,
		limit = req.query.limit;
	res.json({"trending": [], "order": order, "limit": limit});
});

/* Sit back and listen to port */
app.listen(PORT);
console.log("Express server listening on http://127.0.0.1:"+PORT);
