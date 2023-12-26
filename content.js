
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getOrganizationInfo") {
    // Use AJAX to send a request to your Python backend
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://*NodeServerIP*:*NodeServerPort*/get_organization_info", true); // Update the URL accordingly
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        sendResponse({ organization: response });
      }
    };
    xhr.send();
    // Tell Chrome to keep the message channel open until the response is sent asynchronously
    return true;
  }
});
