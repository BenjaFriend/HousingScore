"use strict";

const axios = require('axios');
const jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;

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

class ScoreData
{
    constructor(InAttributeName, InValue, InScore, InPossibleScore)
    {
      this.Name = InAttributeName;
      this.Value = InValue || -1;
      this.Score = InScore || -1;
      this.PossibleScore = InPossibleScore || 10;
    }
}

/**
 * Container of some data for the house.
 */
class HouseData
{
    constructor(InAddress, AttributesArray)
    {
      this.Address = InAddress;
      // If AttributesArray isn't passed it'll initiate an empty array 
      this.Attributes = AttributesArray || [];
    }
};

function SanatizeString(InString) 
{
    return InString.replace(/\D/g,'');
}

/** Parse the given HTML source of the web page and create some house data for us to use */
function ParseSourceHousePage(InPageText)
{
    console.log("Parsing the web page...");

    var OutHouseData = new HouseData("Parsed house Data Address goes here");

    const dom = new JSDOM(InPageText);
    const document = dom.window.document;

    // Get the address
    {
        var AddressClass = "summary__Content-e4c4ok-3 btuvLw";
        const AddressElem = document.getElementsByClassName(AddressClass)[0];

        OutHouseData.Address = AddressElem.textContent;
    }
    
    // Get all the "normal" attributes about a house (the stuff in teh top right)
    {
        var Class = "summary__StyledSummaryDetailUnit-e4c4ok-4 kjpjnt";
        const collection = document.getElementsByClassName(Class);

        for(var i = 0; i < collection.length; i++)
        {
            var Label = collection[i].children[1].textContent;
            var Value = collection[i].children[0].textContent;

            if(Label.startsWith('$'))
            {
                continue;
            }
           
            OutHouseData.Attributes.push(new ScoreData(Label, Value, 5));
        }
    }
    

    // Parse the data on the side bar like the county, lot size, and the year it was built
    {
        var LabelsWeCareAbout = 
        [
            "Year Built",
            "Lot Size",
            "Taxes",
            "Compass Type",
            "HOA Fees"
        ];

        var TableClass = "data-table__TableStyled-ibnf7p-0 bhHpMT";
        const SideTable = document.getElementsByClassName(TableClass)[0];

        for (var i = 0, row; row = SideTable.rows[i]; i++) 
        {
            var Label = row.children[0].textContent;
            var Value = row.children[1].textContent;

            if(!LabelsWeCareAbout.includes(Label) || Value == "-")
            {
                continue;
            }

            OutHouseData.Attributes.push(new ScoreData(Label, Value, 5));
         }
    }

    // Iterate over the "Property information" panel at the bottom of the compass page
    {
        var DetailsClass = "property-information__FieldSection-sc-1il5vdr-7 kTiQQm textIntent-caption1";
        const collection = document.getElementsByClassName(DetailsClass);

        for(var i = 0; i < collection.length; i++)
        {
            var SplitArray = collection[i].textContent.split(":");
            var Label = SplitArray[0];
            var Value = SplitArray[1];

            if(Label.startsWith('$'))
            {
                continue;
            }
           
            OutHouseData.Attributes.push(new ScoreData(Label, Value, 5));
        }
    }

    return OutHouseData;
}

/** Called when the client has given the server a link to the house listing that they want scored */
function setNewHouseLink(res, params)
{
    //console.log("[setNewHouseLink] " + JSON.stringify(params));

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
        var OutHouseData = ParseSourceHousePage(houseUrlRes.data);

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