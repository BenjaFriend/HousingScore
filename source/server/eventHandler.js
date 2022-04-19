"use strict";

const axios = require('axios');

/** Export of a generic function that can parse the URL and give it to the correct function */
module.exports = 
{
    processRequest: function(res, parsedUrl, params) 
    {
        // TODO: Make a map of pathnames -> functions or something like that instead of if statements
        if (parsedUrl.pathname === "/setHouseLink")
        {
            return setNewHouseLink(res, params);
        }

        console.log("[eventHandler::processRequest] There was no matching event for '" + parsedUrl.pathname + "'");
        res.writeHead(400, { "Content-Type" : "text/html"} );
        res.write(JSON.stringify("Failed to find a matching event!"));
        res.end();
    }
}

/**
 * Container of some data for the house.
 */
class HouseData
{
    constructor(InAddress)
    {
      this.Address = InAddress;
      this.Price = -1;
      this.SqFoot = -1;
      this.NumStories = -1;
      this.MinutesToWork = -1;
      this.HoaFee = -1;
      this.NumRooms = -1;
      this.NumBathrooms = -1.5;
      this.bHasGarage = false;
      this.LotSize = -1;
    }
};

/** Parse the given HTML source of the web page and create some house data for us to use */
function ParseSourceHousePage(InPageText)
{
    var OutHouseData = new HouseData("Parsed house Data");

    console.log(InPageText);

    
    return OutHouseData;
}

/** Called when the client has given the server a link to the house listing that they want scored */
function setNewHouseLink(res, params)
{
    console.log("[setNewHouseLink] " + JSON.stringify(params));

    var houseUrl = params.houseUrl;

    if(!houseUrl)
    {
        res.writeHead(400, { "Content-Type" : "text/html"} );
        res.write(JSON.stringify("Oops! Failed to find any data about the given house. Try again"));
        res.end();
        return;
    }

    // Attempt to read the HTTP page from the house URL that was given
    axios
    .get(houseUrl)
    .then(houseUrlRes => 
    {
        var OutHouseData = ParseSourceHousePage(houseUrlRes);

        res.writeHead(200, { "Content-Type" : "text/html"} );
        res.write(JSON.stringify(OutHouseData));
        res.end();
    })

    // There was an error when trying to get that house URL
    .catch(error => 
    {
        console.error(error)

        res.writeHead(400, { "Content-Type" : "text/html"} );
        res.write(JSON.stringify("Failed to query that URL"));
        res.end();
    }); 
}

// TODO: Use google maps to get how far away the house is from home the address

// TODO: Create a class with data fields of all the different scoring weights the client wants