var htttp require('http');
var fs = require('fs');
var path = require('path');

var PORT = 8000;

http.createServer(function(request, response) {
	console.log(request.url);
	if (request.url == '/') {
		//send index.html
	} else {
		//etc
	}
}).listen(PORT);

console.log("server running on http://127.0.0.1:" + PORT + '/');
