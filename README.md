The purpose of this project is for any Agent in Zendesk has the ability to easily see the notes field for a given organization or to modify it. 

This program will display relevant call details in a popup, fetches and updates organization notes, and periodically updates
call data in the background. The server acts as intermediary between the extension and Zendesk's API

Server
------

In the server.js, replace ipAddress const with the server IP address that will run as server. In addition, you must specify the Zendesk Domain, the admin username and the token created

const zendeskDomain = 'zendeskDomain'; 
const apiUsername = 'apiUsername';
const apiToken = 'apiToken';

In the PUT request, you need to specify the Zendesk admin user password for now, I haven't test it using the token instead (I was just following the Zendesk API instructions)

Manifest
---------

In the manifest you can change the icons for the extension.

"icons": {
    "16": "images/logo16.png",   // icon size for toolbar
    "48": "images/logo48.png",   // icon size for extension management page
    "128": "images/logo128.png"  // icon size for the new tab page
  },

HTML
-------
You can change the design of the html if you don't like the one that I created

Popup.js
---------

In the line "if (call.agent.name === 'X agent' && !call.ended) {" you need to modify the "X agent" with the actual name and surname, for instance: "David Batista"

You need to specify the nodejs server

const ipServer = "ipServer"; // Nodejs IP Address
const portServer = "portServer"; // Nodejs port 


content.js
-----------

xhr.open("GET", "http://*NodeServerIP*:*NodeServerPort*/get_organization_info", true); // Update the URL accordingly
