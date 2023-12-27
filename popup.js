const ipServer = "ipServer"; // Nodejs IP Address
const portServer = "portServer"; // Nodejs port 

document.addEventListener('DOMContentLoaded', function () {
  // Retrieve call data from local storage
  chrome.storage.local.get(['callData'], function (result) {
    const callData = result.callData;

    if (callData && callData.calls && callData.calls.length > 0) {
      const callDetailsElement = document.getElementById('callDetails');

      // Check if the element is found in the DOM
      if (!callDetailsElement) {
        console.error('Error: Element with ID "callDetails" not found in the DOM.');
        return;
      }

      callData.calls.forEach((call, index) => {
        // Check if the agent's name is "X agent" and the call has not ended
        if (call.agent.name === 'X agent' && !call.ended) {
          // Display call details with style1
          callDetailsElement.innerHTML += `
            <h2 class="style3">Call ${index + 1}</h2>
            <p class="style1">Direct Number: ${call.customer.direct_number}</p>
            <p class="style1">Email: ${call.customer.email}</p>
            <p class="style1">Name: ${call.customer.name}</p>
            <p class="style1">Organization: ${call.customer.organization ? call.customer.organization.name : 'N/A'}</p>
            <p class="style1">Phone: ${call.customer.phone}</p>
            <h2 class="style3">Ticket Details</h2>
            <p class="style1">Ticket ID: ${call.ticket_id}</p>
          `;

          // Extract orgId from the call data
          const orgId = call.customer.organization_id;

          // Make a request to the server for organization details
          fetch(`http://${ipServer}:${portServer}/organization-details/${orgId}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error: ${response.status}, ${response.statusText}`);
              }
              return response.json();
            })
            .then(orgData => {
              const organizationName = orgData.name;

              const notes = orgData.notes;
              if (notes !== undefined) {
                // Display Notes in the popup
                callDetailsElement.innerHTML += `
                  <h2 class="style3">Organization Notes</h2>
                  <textarea class="style1" style="color: black; resize: none;" rows="5" cols="35">${notes}</textarea>
                  <div style="text-align: center;">
                    <button class="style2 updateNotesButton" data-index="${index}" style="width: 100px; height: 40px; font-weight: bold;">Update Notes</button>
                  </div>
                  <p class="style1 successMessage"></p>
                  <p class="style1 errorMessage"></p>
                `;

                // Pass callData to the function
                setupButtonListener(callData, call, callDetailsElement);
              } else {
                // Display a message when there are no organization notes available
                callDetailsElement.innerHTML += '<p class="style1">No organization notes available.</p>';
              }
            })
            .catch(error => {
              console.error('Error fetching organization details from the server:', error);
              console.error('Response Text:', error.response && error.response.text()); // Log the response text
              // Add logic to handle the error, such as displaying an error message to the user
            });
        } else {
          console.log(`Call ${index + 1} has ended or agent is not Adrian Infante.`);
        }
      });
    } else {
      console.log('No call data available.');
    }
  });
});



// Function to set up the button click event listener
function setupButtonListener(callData, call, callDetailsElement) {
  console.log('Setting up button listener...'); 
  const updateNotesButtons = document.querySelectorAll('.updateNotesButton');
  console.log(updateNotesButtons);
  updateNotesButtons.forEach(updateNotesButton => {
    updateNotesButton.addEventListener('click', function (event) {
      console.log('Button clicked!');
      // Prevent the default form submission behavior
      event.preventDefault();

      const index = this.getAttribute('data-index');
      console.log('Index:', index);

      // Get the notes from the text area
      const notesTextArea = callDetailsElement.querySelector('.style1 textarea');
      const notes = notesTextArea.value;
      console.log('Notes:', notes);

      const organizationId = callData.calls[index].customer.organization_id;

      // Make a request to your Node.js server
      fetch(`http://${ipServer}:${portServer}/updateOrganization/${organizationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: notes }),
      })
      .then(response => {
        if (response.ok) {
          console.log('Organization ID:', organizationId);
          const successMessageElement = callDetailsElement.querySelector('.successMessage');
          successMessageElement.innerText = 'Notes updated successfully!';
          console.log('Notes updated successfully!');

          // Display the request body in the HTML
          const requestBodyElement = document.getElementById('requestBody');
          requestBodyElement.innerText = `Notes updated successfully!`;

          // Clear the content after 5 seconds
          setTimeout(() => {
            requestBodyElement.innerText = '';
          }, 5000);

          const errorMessageElement = callDetailsElement.querySelector('.errorMessage');
          errorMessageElement.innerText = ''; // Clear error message
          return response.json();
        } else {
          throw new Error(`Error: ${response.status}, ${response.statusText}`);
        }
      })
      .then(data => {
        console.log(data);
        // Handle the response as needed
      })
      .catch(error => {
        console.error(error);
        const successMessageElement = callDetailsElement.querySelector('.successMessage');
        successMessageElement.innerText = ''; // Clear success message
        const errorMessageElement = callDetailsElement.querySelector('.errorMessage');
        errorMessageElement.innerText = 'Error updating notes.';
      });
    });
  });
}



