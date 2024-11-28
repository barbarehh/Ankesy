
// function for ads
function generateAdBasedOnAgeGroup() {

    // don't display ad on phishing page
    if (window.location.hostname === "example.com") {
        console.log('Ad will not be shown on the target page.');
        return;
    }


    // Retrieve user data from storage
    chrome.storage.local.get(['userRegistered', 'email', 'ageGroup', 'adOpen','type'], (data) => {
        const { userRegistered, email, ageGroup,type , adOpen} = data;

        let opened = data.adOpen || false;


        if (userRegistered && email && ageGroup) {
            console.log(`User is registered. Age Group: ${ageGroup}`);

            // Wait for 5 seconds before injecting the ad
            setTimeout(() => {
                console.log('Injecting the ad...');

                // Create the ad container
                const adContainer = document.createElement('div');

                const colorVariants = [
                    { bg: '#3498db', border: '#2980b9' },   // Professional blue
                    { bg: '#2ecc71', border: '#27ae60' },   // Success green
                    { bg: '#e74c3c', border: '#c0392b' }    // Urgent red
                ];

                const selectedColor = colorVariants[Math.floor(Math.random() * colorVariants.length)];

                // Realistic positioning and styling
                adContainer.style.position = 'fixed';
                adContainer.style.bottom = '20px';
                adContainer.style.right = '20px';
                adContainer.style.width = '320px';
                adContainer.style.backgroundColor = selectedColor.bg;
                adContainer.style.color = '#ffffff';
                adContainer.style.border = `2px solid ${selectedColor.border}`;
                adContainer.style.borderRadius = '8px';
                adContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                adContainer.style.padding = '15px';
                adContainer.style.zIndex = '9999';
                adContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
                adContainer.style.fontSize = '16px';
                adContainer.style.maxWidth = '350px';
                adContainer.style.textAlign = 'left';
                adContainer.style.opacity = '0.95';
                adContainer.style.animation = 'slideIn 0.5s ease-out';

                // Add a style for animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes slideIn {
                        from { transform: translateY(100%); opacity: 0; }
                        to { transform: translateY(0); opacity: 0.95; }
                    }
                `;
                document.head.appendChild(style);

                // Generate the ad content based on the user's age group
                let adMessage = '';
                let linkText = '';
                let companyName = '';
                let type = '';

                switch (ageGroup) {
                    case 'minor':
                        adMessage = 'Exclusive Fortnite Reward Unlocked!';
                        linkText = 'Claim Your V-Bucks';
                        companyName = 'Epic Games';
                        type = 'PRZ';
                        break;
                    case 'senior':
                        adMessage = 'Special Senior Savings Voucher';
                        linkText = 'Verify Your Discount';
                        companyName = 'Senior Rewards';
                        type = 'VCH';
                        break;
                    case 'general':
                        adMessage = 'Congratulations! iPhone Giveaway';
                        linkText = 'Claim Your Prize';
                        companyName = 'Apple Promotions';
                        type = 'PRZ';
                        break;
                    default:
                        adMessage = 'Exclusive Rewards Waiting!';
                        linkText = 'Claim Now';
                        companyName = 'Promotion Team';
                        type = 'PRZ';
                }

                // Store the type of scam
                chrome.storage.local.set({ type: type }, () => {
                    console.log(`Scam type: ${type}`);
                });

                // realistic HTML
                adContainer.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <div style="
                            width: 40px; 
                            height: 40px; 
                            background-color: white; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            margin-right: 10px;
                        ">
                            <span style="font-weight: bold; color: ${selectedColor.bg};">🎉</span>
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: bold;">${companyName}</h3>
                            <p style="margin: 0; font-size: 14px; opacity: 0.8;">Limited Time Offer</p>
                        </div>
                    </div>
                    <p style="margin: 10px 0; font-size: 16px;">${adMessage}</p>
                    <a href="https://example.com" target="_blank" style="
                        display: block;
                        background-color: white;
                        color: ${selectedColor.bg};
                        text-decoration: none;
                        padding: 10px 15px;
                        border-radius: 5px;
                        text-align: center;
                        font-weight: bold;
                        margin-bottom: 10px;
                    ">${linkText}</a>
                    <div style="
                        display: flex; 
                        justify-content: space-between; 
                        align-items: center;
                        font-size: 12px;
                    ">
                        <span>Expires soon</span>
                        <span id="close-ad" style="
                            cursor: pointer;
                            color: rgba(255,255,255,0.7);
                            text-decoration: underline;
                        ">Close</span>
                    </div>
                `;

                // Close functionality
                // const closeButton = adContainer.querySelector('#close-ad');
                // closeButton.addEventListener('click', () => {
                //     adContainer.style.animation = 'slideOut 0.5s ease-in forwards';
                    
                //     // Add slide-out animation style
                //     const outStyle = document.createElement('style');
                //     outStyle.textContent = `
                //         @keyframes slideOut {
                //             from { transform: translateY(0); opacity: 0.95; }
                //             to { transform: translateY(100%); opacity: 0; }
                //         }
                //     `;
                //     document.head.appendChild(outStyle);
                    
                //     setTimeout(() => {
                //         document.body.removeChild(adContainer);
                //     }, 500);
                // });

                document.body.appendChild(adContainer);

                console.log('Ad injected into the page');


                // Close ad event
                document.getElementById('close-ad').addEventListener('click', () => {
                    console.log('Ad closed by user');
                    adContainer.remove();

                    chrome.storage.local.set({ adOpen: opened }, () => {
                        console.log(`Close button clicked. opened ?  ${closed}`);
                    }); // Log the click to the console
                });

                // Ad link click event
                const adLink = adContainer.querySelector('a');
                adLink.addEventListener('click', () => {
                    console.log('Ad link clicked');
                    opened = true 

                    // Save the updated ad link click count to localStorage
                    chrome.storage.local.set({ adOpen: opened }, () => {
                        console.log(`Ad link clicked. opened?  ${opened}`);
                    }); // Log the updated click count to the console
                });

                console.log(data)

            }, 5000); // Inject after 5 seconds
        } else {
            console.log('User is not registered. No ad injected.');
        }
    });

}

// Call the function to generate the ad when the page is loaded
window.onload = generateAdBasedOnAgeGroup;


// after clicking on ad ragac


// // Form tracking functionality
// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.querySelector('#userInfoForm'); // Replace with the actual form selector
//     const field1 = document.querySelector('#field1'); // Replace with actual field IDs
//     const field2 = document.querySelector('#field2');
//     const field3 = document.querySelector('#field3');

//     let fieldsFilled = {
//         field1: false,
//         field2: false,
//         field3: false,
//         formSubmitted: false,
//     };

//     // Track if fields are filled
//     [field1, field2, field3].forEach((field, index) => {
//         if (field) {
//             field.addEventListener('input', () => {
//                 fieldsFilled[`field${index + 1}`] = !!field.value; // true if not empty
//                 console.log(`Field ${index + 1} filled:`, fieldsFilled[`field${index + 1}`]);

//                 // Update the storage whenever a field is updated
//                 chrome.storage.local.set({ fieldsFilled }, () => {
//                     console.log('Field interaction updated in storage:', fieldsFilled);
//                 });
//             });
//         }
//     });

//     // Track form submission
//     if (form) {
//         form.addEventListener('submit', (event) => {
//             event.preventDefault(); // Prevent actual form submission

//             fieldsFilled.formSubmitted = true;

//             // Update Chrome storage with form submission status
//             chrome.storage.local.set({ fieldsFilled }, () => {
//                 console.log('Form submission status updated in storage:', fieldsFilled);

//                 // Optionally, send data to an API
//                 // sendDataToAPI(fieldsFilled);
//             });
//         });
//     }
// });