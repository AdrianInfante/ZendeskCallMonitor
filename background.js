
chrome.runtime.onInstalled.addListener(function() {
  console.log('Zendesk Call Monitor Extension Installed');
});

const serverEndpoint = 'http://10.253.0.95:3000/zendesk-data'; // Update local server's endpoint

function makeZendeskAPICall() {
  // Make the API request to the local server
  fetch(serverEndpoint)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Error: ${response.status}, ${response.statusText}`);
      }
    })
    .then(callData => {
      console.log('Call Data:', callData);

      // Store the call data in local storage
      chrome.storage.local.set({ callData });

      // Fetch organization details for each call
      callData.calls.forEach(call => {
        const orgId = call.customer.organization_id;
      
        console.log('Fetching data from:', serverEndpoint); 
        fetch(`http://10.253.0.95:3000/organization-details/${orgId}`)
          .then(orgDetailsResponse => orgDetailsResponse.json())
          .then(orgDetails => {
            // Merge organization details with the existing call data
            const updatedCallData = {
              ...callData,
              organizationDetails: {
                ...callData.organizationDetails,
                [orgId]: orgDetails
              }
            };
      
            // Store the updated call data in local storage
            chrome.storage.local.set({ callData: updatedCallData });
          })
          .catch(error => {
            console.error('Error fetching organization details:', error);
          });
      });
    })
    .catch(error => {
      console.error(error);
    });
}



// Set up periodic API calls
const pollInterval = 5000; // 5 seconds

function pollZendeskAPI() {
  makeZendeskAPICall();
  setTimeout(pollZendeskAPI, pollInterval);
}

// Start polling when the extension is installed
pollZendeskAPI();
