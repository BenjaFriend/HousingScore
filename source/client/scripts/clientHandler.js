"use strict";

(function() 
{
    window.addEventListener("load",function()
    {
        init();
    }, 
    false);


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
  
    /**
     * Initalize the client page. Sets up listeners for any button presses and that kind of thing
     */
    function init()
    {
        // Add a listener for scheudling
        document.querySelector("#setHouseLink").addEventListener("submit", setHouseLink);

        var TestHouseData = new HouseData("LOCAL Test Address 123 Cary NC");
        TestHouseData.Attributes.push(new ScoreData("Price", 123456, 5));
        TestHouseData.Attributes.push(new ScoreData("Square Foot", 1400, 4, 5));
        TestHouseData.Attributes.push(new ScoreData("Number of Rooms", 3, 9));
        TestHouseData.Attributes.push(new ScoreData("Bathrooms", 2.5, 10));
        
        CreateResultsDisplay(TestHouseData);
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
        ResetDisplayedHouseData();
        
        // Stop the page from relaoding when you press the button
        e.preventDefault();

        var clientSetHouseLink = GetHouseLink();

        if(!clientSetHouseLink)
        {
            AddErrorMessage("No link was given! Please provide a link before attempting to gather some data");
            return;
        }

        var xhr = new XMLHttpRequest();
        var action = document.querySelector("#setHouseLink").getAttribute("action");

        var url = action + "?houseUrl=" + clientSetHouseLink;

        xhr.onload = function()
        {
            // Tell the user that their request has been recieved
            if(xhr.status == 200)
            {
                OnHouseDataRecieved(JSON.parse(xhr.responseText));
            }
            else
            {
                AddErrorMessage("A bad URL was given, we couldn't query it! Change it and try again");
                return;
            }  
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

        CreateResultsDisplay(responseJSON);
    }

    /** Creates a new table and appends it to the result div with info all about our house */
    function CreateResultsDisplay(InHouseData)
    {
        var responseDiv = GetResponseDiv();
        var CurrentScore = 0;
        var BestPossibleScore = 0;

        // Add the address as a header
        {
            var p = document.createElement("h2");
            var node = document.createTextNode(InHouseData.Address);
            p.appendChild(node);
            responseDiv.appendChild(p);
        }

        {
            var p = document.createElement("h3");
            var node = document.createTextNode("House Score Chart");
            p.appendChild(node);
            responseDiv.appendChild(p);
        }

        // Create a table for the attributes
        {
            var table = document.createElement('table');
            table.classList.add("ScoreTable");
            table.style.border = '1px solid black';
            
            // Create table labels
            {
                var AtttributeLabel = document.createElement('th');
                var AtttributeLabelText = document.createTextNode("Attribute");
                AtttributeLabel.appendChild(AtttributeLabelText);
                
                var ValueLabel = document.createElement('th');
                var ValueLabelText = document.createTextNode("Value");
                ValueLabel.appendChild(ValueLabelText);
    
                var ScoreLabel = document.createElement('th');
                var ScoreLabelText = document.createTextNode("Score");
                ScoreLabel.appendChild(ScoreLabelText);

                var BestScoreLabel = document.createElement('th');
                var BestScoreLabelText = document.createTextNode("Best Possible Score");
                BestScoreLabel.appendChild(BestScoreLabelText);

                table.appendChild(AtttributeLabel);
                table.appendChild(ValueLabel);
                table.appendChild(ScoreLabel);
                table.appendChild(BestScoreLabel);
            }
            

            // For each attribute in the house data
            for(var i = 0; i < InHouseData.Attributes.length; i++) 
            {
                var AttributeObject = InHouseData.Attributes[i];

                CurrentScore += AttributeObject.Score;
                BestPossibleScore += AttributeObject.PossibleScore;

                const Row = table.insertRow();

                const NameCell = Row.insertCell();
                NameCell.appendChild(document.createTextNode(AttributeObject.Name));
                NameCell.setAttribute("id","testID");

                const ValueCell = Row.insertCell();
                ValueCell.appendChild(document.createTextNode(AttributeObject.Value));

                const ScoreCell = Row.insertCell();
                ScoreCell.appendChild(document.createTextNode(AttributeObject.Score));

                const BestScoreCell = Row.insertCell();
                BestScoreCell.appendChild(document.createTextNode(AttributeObject.PossibleScore));
            }

            responseDiv.appendChild(table);
        }

        // Display the total score
        {
            var p = document.createElement("h3");
            var Percentage = (CurrentScore / BestPossibleScore) * 100;
            var node = document.createTextNode("Total Score: " + CurrentScore + " / " + BestPossibleScore + " (" + Percentage +"%)");
            p.appendChild(node);
            responseDiv.appendChild(p);
        }
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