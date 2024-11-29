document.getElementById('registration-form').addEventListener('submit', (event) => {
    event.preventDefault();


    const email = document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const rep_password=document.getElementById('confirm-password').value;
    const ageGroup = document.getElementById('age-group').value;

    // strong password generator
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;




    if (!email || !ageGroup|| !password||!rep_password) {
        // Show error message if any field is empty
        document.getElementById('error').textContent = "Please fill out all fields.";
        return;
    }

    // Debugging passwords (remove in production)
    console.log("Password:", password);
    console.log("Re-entered Password:", rep_password);
    if(password!==rep_password){
        document.getElementById('error').textContent = "Passwords do not match, please enter correctly";
        return;
    }

    if (!strongPasswordRegex.test(password)) {
        document.getElementById('error').textContent = "Password must be at least 8 characters with a mix of uppercase, lowercase, and numbers.";
        return;
    }

    document.getElementById('error').textContent = "";

    


    // Store the user data in local storage
    // Aq sheileba davamatot kidev daasubmita tu ara phisihng linkze

    chrome.storage.local.set({ userRegistered: true, email, password, ageGroup, adOpen: false, type: ""}, () => {
        alert('Registration successful! You are now ready to use the extension. Click OK to proceed.');

        document.getElementById('registration-form').reset();
        // Close the page after the alert is closed
        window.close();
    });


});
