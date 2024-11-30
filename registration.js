document.getElementById('registration-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rep_password = document.getElementById('confirm-password').value;

    // Strong password check
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Validate required fields
    if (!email ||  !password || !rep_password) {
        document.getElementById('error').textContent = "Please fill out all fields.";
        return;
    }

    // Check if passwords match
    if (password !== rep_password) {
        document.getElementById('error').textContent = "Passwords do not match, please enter correctly.";
        return;
    }

    // Validate password strength
    if (!strongPasswordRegex.test(password)) {
        document.getElementById('error').textContent = "Password must be at least 8 characters with a mix of uppercase, lowercase, and numbers.";
        return;
    }

    // Clear error message
    document.getElementById('error').textContent = "";

    // Prepare data to send to the API
    const data = {
        email: email,
        password: password// Include age group if required by the API
    };

    console.log(data)

    // Send the POST request using the Fetch API
    fetch('https://ankesy.site/auth/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)  // Convert the data to JSON format
    })
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            if (data.error) {
                // If the API returns an error (e.g., email already taken)
                document.getElementById('error').textContent = `Registration failed: ${data.message || 'An error occurred.'}`;
            } else {
                // If registration is successful
                alert('Registration successful! You are now ready to use the extension. Click OK to proceed.');

                // Store the user data in local storage only after successful registration
                chrome.storage.local.set({
                    userRegistered: true,
                    email,
                    password,
                    adOpen: false,
                    type: "PRZ"
                }, () => {
                    document.getElementById('registration-form').reset();
                    // Close the page after the alert is closed
                    window.close();
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error').textContent = 'An error occurred. Please try again later.';
        });
});

