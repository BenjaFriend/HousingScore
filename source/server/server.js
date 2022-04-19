"use strict";

/** Requirements for the server to run in general */
var http = require('http');
var url = require('url');
var query = require('querystring');
var fs = require('fs');

// The event handler module is a script that we can pass events to that the client asks for
var eventHandlerModule = require('./eventHandler');

// TODO: Read in the index once
//var indexHtmlFile = fs.readFileSync(__dirname + "/../client/index.html");
//var style = fs.readFileSync(__dirname + "/../client/styles.css");
//var clientHandlerScript = fs.readFileSync(__dirname + "/../client/scripts/clientHandler.js");

/** Function to handle our HTTP web requests */
function onRequest(req, res) 
{
    var parsedUrl = url.parse(req.url);
    var params = query.parse(parsedUrl.query);
    console.dir("\nthe query is: " + req.url);

    // If the web page asked for styles.css
    if(parsedUrl.pathname === "/styles.css")
    {
        var style = fs.readFileSync(__dirname + "/../client/styles.css");
        res.writeHead(200, { "Content-Type" : "text/css" } );
        res.write(style);
        res.end();
    }
    // Return the index.html file for the base
    else if(parsedUrl.pathname === "/")
    {
        // Pass this data to our event handler
        // read in the index file every time there is a query
        // this sucks but makes dev a lot easier cause you dont have to restart the server each time. Change this for prod
        var indexHtmlFile = fs.readFileSync(__dirname + "/../client/index.html");
        res.writeHead(200, { "Content-Type" : "text/html"} );
        res.write(indexHtmlFile);
        res.end(); 
    }
    // Return the client side java script
    else if(parsedUrl.pathname === "/scripts/clientHandler.js")
    {
        var clientHandlerScript = fs.readFileSync(__dirname + "/../client/scripts/clientHandler.js");
        res.writeHead(200, { "Content-Type" : "text/javascript	"} );
        res.write(clientHandlerScript);
        res.end();
    }
    // If the request wasnt a known file name, then pass it to our event handler
    else 
    {
        eventHandlerModule.processRequest(res, parsedUrl, params);
    }
}


// Actually start the server on the port set in the enviornment, or just default to 3000
var port = process.env.PORT || 3000;
http.createServer(onRequest).listen(port);
console.log("listening on port " + port);