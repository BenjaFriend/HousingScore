"use strict";

(function() 
{
    window.addEventListener("load",function()
    {
        init();
    }, 
    false);

  
    /**
     * Initalize the client page. Sets up listeners for any button presses and that kind of thing
     */
    function init()
    {
        // Add a listener for scheudling
        document.querySelector("#setHouseLink").addEventListener("submit", setHouseLink);
    }

    /** Get the value set by the user about what house they want to look at. This returns a URL from the text box */
    function GetHouseLink()
    {
        return document.getElementById("houseLink").value;
    }

    /** 
     * Tell the server the link that we want to use for the current house.
     * Set the callback for when the server gives us the nifty info about it
     */
    function setHouseLink(e)
    {
        // Stop the page from relaoding when you press the button
        e.preventDefault();

        console.log("House Link");

        var clientSetHouseLink = GetHouseLink();
        console.log("the house link is '" + clientSetHouseLink + "'");
        if(!clientSetHouseLink)
        {
            AddErrorMessage("No link was given! Please provide a link before attempting to gather some data");
            return;
        }

        var xhr = new XMLHttpRequest();
        var url = "/newHouseLink";

        xhr.onload = function()
        {
            // Tell the user that their request has been recieved            
            OnHouseDataRecieved(JSON.parse(xhr.responseText));
        };

        // Send the request to the server
        xhr.open('GET', url);
        xhr.send();
    }

    /** Returns the div that we want to place any server response data in */
    function GetResponseDiv()
    {
        return document.getElementById("HouseData");
    }

    /** Callback for when the server has told us about the house that we pasted the link in */
    function OnHouseDataRecieved(responseJSON)
    {
        ResetDisplayedHouseData();
        console.dir(responseJSON);

        var responseDiv = GetResponseDiv();

        var p = document.createElement("p");
        var node = document.createTextNode("No feedings currently are scheduled.");
        p.appendChild(node);
        responseDiv.appendChild(p)
        return;     
    }

    /** Display an error message to the user in the response div */
    function AddErrorMessage(message)
    {
        ResetDisplayedHouseData();
        // TODO: Error message color/styling
        var responseDiv = GetResponseDiv();

        var p = document.createElement("p");
        var node = document.createTextNode(message);
        p.appendChild(node);
        responseDiv.appendChild(p);
        return;
    }

    /** Empty out the house data div */
    function ResetDisplayedHouseData()
    {
        var responseDiv = GetResponseDiv();
        responseDiv.innerHTML = "";
        return;
    }

}()); // End IFFY