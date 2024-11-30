// function for ads
function generateAd() {
    // don't display ad on phishing page
    if (window.location.hostname === "example.com") {
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
                        chrome.storage.local.set({ adOpen: true }, () => {
                            console.log('Ad closed by user');
                        });
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
                ctaButton.href = '#';

                ctaButton.addEventListener('click', () => {
                    console.log('Ad link clicked');
                    chrome.storage.local.set({ adOpen: true }, () => {
                        console.log('Ad link clicked and tracked');
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