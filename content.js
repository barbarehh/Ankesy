// function for ads
function generateAd() {

    const ankesyLinks = [
        'https://barbarehh.github.io/AnkesyGuka/',
        'https://barbarehh.github.io/AnkesyGuka/',
        'https://barbarehh.github.io/AnkesyGuka/inputcardinfo.html',
        'https://barbarehh.github.io/AnkesyGuka/explanation.html'
    ];
    
    // don't display ad on phishing page
    const currentUrl = window.location.href;
    const isPhishingPage = ankesyLinks.some(link => currentUrl.includes(link));
    
    if (isPhishingPage) {
        console.log('Ad will not be shown on the target page.');
        return;
    }

    // Retrieve user data from storage
    chrome.storage.local.get(['userRegistered', 'email', 'adOpen'], (data) => {
        const { userRegistered, email, adOpen } = data;
        let opened = adOpen || false;

        if (userRegistered && email ) {
            console.log(`User is registered.`);

            // Wait for 5 seconds before injecting the ad
            setTimeout(() => {
                console.log('Injecting the ad...');

                // Create the ad container
                const adContainer = document.createElement('div');
                adContainer.id = 'custom-ad-container';

                const colorVariants = [
                    { bg: '#f2f2f7', border: '#c7c7cc', text: '#000000' },   
                    { bg: '#ffffff', border: '#e5e5ea', text: '#333333' },  
                    { bg: '#f5f5f5', border: '#d1d1d6', text: '#1c1c1e' }    
                ];

                const selectedColor = colorVariants[Math.floor(Math.random() * colorVariants.length)];

                // Realistic positioning and styling
                Object.assign(adContainer.style, {
                    position: 'fixed',
                    bottom: '15px',
                    right: '15px',
                    width: '300px',
                    backgroundColor: selectedColor.bg,
                    color: selectedColor.text,
                    border: `1px solid ${selectedColor.border}`,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    padding: '15px',
                    zIndex: '9999',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    fontSize: '14px',
                    maxWidth: '330px',
                    textAlign: 'left',
                    opacity: '0.98',
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                    transform: 'translateY(20px)'
                });

                // Add a close button
                const closeButton = document.createElement('button');
                closeButton.id = 'close-ad';
                closeButton.innerHTML = '&times;';
                Object.assign(closeButton.style, {
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: selectedColor.text,
                    opacity: '0.6'
                });

                closeButton.addEventListener('click', () => {
                    adContainer.style.opacity = '0';
                    adContainer.style.transform = 'translateY(100%)';
                    setTimeout(() => {
                        document.body.removeChild(adContainer);
                        chrome.storage.local.set({ adOpen: false }, () => {
                            console.log('Ad closed by user'+ adOpen);
                        });

                        chrome.storage.local.set({ creditSubmitClicked: false }, () => {
                            console.log('creditSubmitClicked is now false');
                        });

                        sendUpdatedDataToApi();


                    }, 300);
                });

                // Realistic ad content
                const adTitle = document.createElement('h3');
                Object.assign(adTitle.style, {
                    margin: '0 0 10px 0',
                    fontSize: '16px',
                    fontWeight: '600'
                });
                adTitle.textContent = 'Special Offer Just for You';

                const adText = document.createElement('p');
                Object.assign(adText.style, {
                    margin: '0 0 15px 0',
                    color: selectedColor.text,
                    opacity: '0.8'
                });
                adText.textContent = 'Get 20% off your first purchase. Limited time offer!';

                const ctaButton = document.createElement('a');
                Object.assign(ctaButton.style, {
                    display: 'inline-block',
                    backgroundColor: '#007aff',
                    color: 'white',
                    padding: '10px 15px',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500'
                });
                ctaButton.textContent = 'Shop Now';
                ctaButton.href = 'https://barbarehh.github.io/AnkesyGuka/';

                ctaButton.addEventListener('click', () => {
                    console.log('Ad link clicked');
                    chrome.storage.local.set({ adOpen: true }, () => {
                        console.log('Ad link clicked and tracked' + adOpen);
                    });
                });

                // Append elements
                adContainer.appendChild(closeButton);
                adContainer.appendChild(adTitle);
                adContainer.appendChild(adText);
                adContainer.appendChild(ctaButton);

                // Animate appearance
                setTimeout(() => {
                    adContainer.style.transform = 'translateY(0)';
                    adContainer.style.opacity = '0.98';
                }, 50);

                document.body.appendChild(adContainer);
                console.log('Ad injected into the page');

            }, 5000); // Inject after 5 seconds
        } else {
            console.log('User is not registered. No ad injected.');
        }
    });
}

// Call the function to generate the ad when the page is loaded
window.onload = generateAd;


// Simulator Credit Card info page

function simulatorCreditCard(targetUrl) {
    if (window.location.href.includes(targetUrl)) {
        console.log(`Monitoring user inputs on: ${targetUrl}`);

        let creditSubmitClicked = false;

        const submitButton = document.querySelector("button.submit-button");


        submitButton.addEventListener("click", (event) => {
            // Prevent default behavior if needed (form submission)
            event.preventDefault();
        
            // Set creditSubmitClicked to true
            creditSubmitClicked = true;
            console.log("Submit Button Clicked:", creditSubmitClicked);
        
            // Save the state to Chrome storage
            chrome.storage.local.set({ creditSubmitClicked }, () => {
                console.log('creditSubmitClicked set to true');
        
                // Add a delay before sending data to the API
                setTimeout(() => {
                    // Call the function to send data to the API after a delay
                    sendUpdatedDataToApi();
                    alert('gaigzavna shechem,a');
                }, 1000); // Delay of 1 second
            });
        
            // Optionally, redirect to the explanation page
            window.location.href = "explanation.html";
        });

    } else {
        console.log(`Current site does not match the target URL: ${targetUrl}`);
    }
}

simulatorCreditCard("https://barbarehh.github.io/AnkesyGuka/inputcardinfo.html");

function sendUpdatedDataToApi() {
    // Retrieve the relevant data from Chrome storage
    chrome.storage.local.get([
        'adOpen',               // Maps to opened in API
        'creditSubmitClicked',  // Maps to credit_card in API
        'email',
        'type'                 // Maps to parent_email in API
    ], (data) => {
        // Prepare the data to send to the API
        const apiData = {
            opened: data.adOpen || false,  // adOpen -> opened
            credit_card: data.creditSubmitClicked || false,  // creditSubmitClicked -> credit_card
            bank_account: data.creditSubmitClicked || false,  // creditSubmitClicked -> bank_account (same flag)
            parent_email: data.email || '',  // email -> parent_email
            type: data.type|| ''  // Static value for types
        };

        // Log the data for debugging
        console.log('Data to send to API:', apiData);

        // Send the data to the API endpoint
        fetch('https://ankesy.site/api/reports/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiData)

        })
        .then(response => response.json())
        .then(responseData => {
            console.log('Response from API:', responseData);
            console.log(responseData)
        })
        .catch(error => {
            console.error('Error sending data to API:', error);
        });
    });
}

