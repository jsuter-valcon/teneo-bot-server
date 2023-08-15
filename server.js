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
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
})

server.listen(process.env.PORT || 3000)
