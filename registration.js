document.getElementById('registration-form').addEventListener('submit', (event) => {
    event.preventDefault();


    const email = document.getElementById('email').value;
    const ageGroup = document.getElementById('age-group').value;

    if (!email || !ageGroup) {
        // Show error message if any field is empty
        document.getElementById('error').textContent = "Please fill out all fields.";
        return;
    }

    // Store the user data in local storage
    // Aq sheileba davamatot kidev daasubmita tu ara phisihng linkze

    chrome.storage.local.set({ userRegistered: true, email, ageGroup, adOpen: false, type: "" }, () => {
        console.log("User registered:", { email, ageGroup });

        alert('Registration successful! You are now ready to use the extension. Click OK to proceed.');

        document.getElementById('registration-form').reset();


        // Close the page after the alert is closed
        window.close();
    });

});
