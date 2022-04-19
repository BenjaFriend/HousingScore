"use strict";

/** Export of a generic function that can parse the URL and give it to the correct function */
module.exports = 
{
    processRequest: function(res, parsedUrl, params) 
    {
        // TODO: Make a map of pathnames -> functions or something like that instead of if statements
        if (parsedUrl.pathname === "/newHouseLink")
        {
            return setNewHouseLink(res, params);
        }

        console.log("[eventHandler::processRequest] There was no matching event for '" + parsedUrl.pathname + "'");
        res.writeHead(400, { "Content-Type" : "text/html"} );
        res.write(JSON.stringify("Failed to find a matching event!"));
        res.end();
    }
}


/** Called when the client has given the server a link to the house listing that they want scored */
function setNewHouseLink(res, params)
{
    console.log("New house link!!!!");
    console.log(params);

    // If we have all the proper data...
    if(params.newLink && params.hours && params.door && params.setting)
    {
        var Feeding = new FeedEvent(params.date, params.hours, params.door, params.setting, EventID++);
        allEvents.push(Feeding);

        // TODO: Add this data to a database instead of an array
        res.writeHead(200, { "Content-Type" : "text/html"} );
        res.write(JSON.stringify("Successfully scheduled event!"));
    }
    // Otherwise the data is invalid
    else
    {
        res.writeHead(400, { "Content-Type" : "text/html"} );
        res.write(JSON.stringify("Failed to schedule event! Invalid creation data!"));
    }

    res.end();
}


// TODO: Use google maps to get how far away the house is from home the address

// TODO: Create a class with data fields of all the different scoring weights the client wants