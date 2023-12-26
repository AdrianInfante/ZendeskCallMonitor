
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');

const ipAddress = 'Nodejs'; // Replace with your static IP address
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());


const zendeskDomain = 'zendeskDomain'; // Company's Zendesk Domain
const apiUsername = 'apiUsername';
const apiToken = 'apiToken';
const zendeskApiEndpoint = `https://${zendeskDomain}.zendesk.com/api/v2/channels/voice/calls`;


app.get('/organization-details/:orgId', async (req, res) => {
  try {
    const orgId = req.params.orgId;

    // Request to Zendesk for organization details
    const organizationDetailsResponse = await fetch(`https://${zendeskDomain}.zendesk.com/api/v2/organizations/${orgId}.json`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Basic ' + Buffer.from(`${apiUsername}/token:${apiToken}`).toString('base64')
      })
    });

    if (organizationDetailsResponse.ok) {
      const orgDetails = await organizationDetailsResponse.json();

   
      console.log('Received organization details:', orgDetails);

      // Check if 'organization' property exists in the response
      if (orgDetails.organization !== undefined) {
        const notes = orgDetails.organization.notes;

        // Log 'notes' for debugging
        console.log('Notes:', notes);

        if (notes !== undefined) {
          res.json({ notes });
        } else {
          res.json({ notes: 'No organization notes available.' });
        }
      } else {
        
        res.json({ notes: 'No organization details available.' });
      }
    } else {
      throw new Error(`Error: ${organizationDetailsResponse.status}, ${organizationDetailsResponse.statusText}`);
    }
  } catch (error) {
    console.error('Error fetching organization details from the server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put("/updateOrganization/:id", async (req, res) => {

    const request = require('request');

    const organizationId = req.params.id;
    const updatedNotes = req.body.notes;

    const url = `https://${zendeskDomain}.zendesk.com/api/v2/organizations/${organizationId}`;

    const options = {
      method: "PUT",
      url: url,
      auth: {
        user: apiUsername,
        pass: "password", // Administrator agent's password
      },
      headers: {
        "Content-Type": "application/json",
      },
      json: {
        organization: {
          notes: updatedNotes,
        },
      },
    };

    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(response.statusCode).send(body);
      }
    });
  });





app.get('/zendesk-data', async (req, res) => {
  try {

    const response = await fetch(zendeskApiEndpoint, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Basic ' + Buffer.from(`${apiUsername}/token:${apiToken}`).toString('base64')
      })
    });

    if (response.ok) {
      const data = await response.json();
      res.json(data);
    } else {
      throw new Error(`Error: ${response.status}, ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, ipAddress, () => {
  console.log(`Server is running at http://${ipAddress}:${port}`);
});
