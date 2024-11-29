
chrome.runtime.onInstalled.addListener(() => {
    // Check if user is already registered
    chrome.storage.local.get("userRegistered", (data) => {
        if (!data.userRegistered) {
            setTimeout(() => {
                // Redirect to registration page if not registered
                chrome.tabs.create({ url: 'introduction.html' });
            }, 2000); // 2000ms = 2 seconds delay
        }
    });
});


// listen from content js to get data 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendRegToAPI') {
        sendDataToApi(message.userData);
    }
});


// send to api data from user

function sendDataToApi(data) {
    const apiEndpoint = 'https://ankesy.site/auth/users/';

    console.log('Sending data to API:', data);

    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        // Check if the response is successful
        if (!response.ok) {
            // If not, throw an error with the status code
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Parse JSON if the response is valid
        return response.json();
    })
    .then(responseData => {
        console.log('Data successfully sent to API:', responseData);
    })
    .catch(error => {
        console.error('Error sending data to API:', error);
    });
}


