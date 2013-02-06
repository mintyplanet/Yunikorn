var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var PORT = 8000;

MIME_TYPES = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.txt': 'text/plain'
	//TODO: add image mime types
};

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

function serveTopic(req, resp, urlParts){
		hello(resp);
}

// Just an Aussie greeting
function hello(resp) {
	resp.writeHead(200, {'Content-Type':'text/plain'});
	resp.end("G'day");
}

http.createServer(function(request, response) {
	//console.log(request.url);
	var urlParts = url.parse(request.url),
		pathname = urlParts.pathname;
		console.log(pathname);
	//All REST calls 
	if (pathname.match(/^\/(topic|comment)/)) {
		serveTopic(request, response, urlParts);
	} else {
		pathname = (pathname=='/') ? '/index.html' : pathname;
		serveFile('.'+pathname, response);
	}
}).listen(PORT);
console.log("server running on http://127.0.0.1:" + PORT + '/');

