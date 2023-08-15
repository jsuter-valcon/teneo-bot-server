const http = require('http');
const express = require('express');
const fs = require('fs')
const path = require('path');
const app = express();
const router = express.Router();

// Tell express to use this router with /api before.
app.use("/", router);
app.use("/images", express.static(path.join(__dirname, 'images')));

//const collectionspage = require(path.resolve('/images', 'collectionspage.jpg'));
//const twilio_voice_instance = new twilio_voice();

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if(req.url === "/"){
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream('index.html').pipe(res)
  }
  else if(/^\/[a-zA-Z0-9\/-]*.js$/.test(req.url.toString())){
	sendFileContent(res, req.url.toString().substring(1), "text/javascript");
  }
  else if(/^\/[a-zA-Z0-9\/-]*.css$/.test(req.url.toString())){
	sendFileContent(res, req.url.toString().substring(1), "text/css");
  }
  else if(/^\/[a-zA-Z0-9\/-]*.png$/.test(req.url.toString())){
	sendFileContent(res, req.url.toString().substring(1), "image/text");
  }
  else{
	console.log("Requested URL is: " + request.url);
	response.end();
  }
	
})

server.listen(process.env.PORT || 3000)var http = require('http');

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
