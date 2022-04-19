"use strict";

var http = require('http');
var url = require('url');
var query = require('querystring');
var fs = require('fs');


var port = process.env.PORT || 3000;

// read in our html file to serve back
var indexHtmlFile = fs.readFileSync(__dirname + "/../client/index.html");
var style = fs.readFileSync(__dirname + "/../client/styles.css");
//var favicon = fs.readFileSync(__dirname + "/../client/favicon.png");

/** Function to handle our HTTP web requests */
function onRequest(req, res) 
{
  var parsedUrl = url.parse(req.url);
  var params = query.parse(parsedUrl.query);
  console.dir("the query is: " + req.url);

  // If the web page asked for styles.css
  if(parsedUrl.pathname === "/styles.css")
  {
    res.writeHead(200, { "Content-Type" : "text/css" } );
    res.write(style);
    res.end();
  }
//   else if(parsedUrl.pathname === "/favicon.png" || parsedUrl.pathname === "/favicon.ico")
//   {
//     res.writeHead(200, {'Content-Type': 'image/x-icon'} );
//     res.write(favicon);
//     res.end();
//   }
  else if(parsedUrl.pathname === "/scripts/servoControls.js")
  {
    res.writeHead(200, { "Content-Type" : "text/javascript	"} );
    res.write(servoControlScript);
    res.end();
  }
  // Send the index page if something else happens
  else 
  {
    res.writeHead(200, { "Content-Type" : "text/html"} );
    res.write(indexHtmlFile);
    res.end(); 
  }
}

http.createServer(onRequest).listen(port);
console.log("listening on port " + port);