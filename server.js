var http = require('http');
var fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

http.createServer(function(request, response) {
	//console.log("Requested URL is: " + request.url.toString());
	//console.log((/^\//.test(request.url.toString())));
	if(request.url === "/index"){
		sendFileContent(response, "index.html", "text/html");
	}
	else if(request.url === "/"){
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
	}
	else if(/^\/[a-zA-Z0-9\/-]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/-]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
		else if(/^\/[a-zA-Z0-9\/-]*.png$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "image/text");
	}
	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}
}).listen(8080);

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}
