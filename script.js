// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting the traditional way

    // Get the values from the form
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation
    if (!username || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Simulate a backend login request
    simulateLogin(username, password)
        .then(response => {
            alert(`Login Successful!\nUsername: ${username}`);
            // Redirect to a dashboard or another page (optional)
            // window.location.href = 'dashboard.html';
        })
        .catch(error => {
            alert(`Login Failed: ${error}`);
        });

    // Clear the form fields (optional)
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// Reconnect Form Submission
document.getElementById('reconnectForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting the traditional way

    // Get the value from the form
    const mpesaCode = document.getElementById('mpesaCode').value;

    // Simple validation
    if (!mpesaCode) {
        alert('Please enter your M-PESA code.');
        return;
    }

    // Simulate a backend reconnect request
    simulateReconnect(mpesaCode)
        .then(response => {
            alert(`Reconnect Successful!\nM-PESA Code: ${mpesaCode}`);
            // Redirect to a success page or update UI (optional)
            // window.location.href = 'success.html';
        })
        .catch(error => {
            alert(`Reconnect Failed: ${error}`);
        });

    // Clear the form field (optional)
    document.getElementById('mpesaCode').value = '';
});

// Package Selection
document.querySelectorAll('.package button').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevents the default button behavior
        const packageName = this.parentElement.querySelector('h3').textContent;
        const packagePrice = this.parentElement.querySelector('p').textContent;

        // Simulate package selection
        simulatePackageSelection(packageName, packagePrice)
            .then(response => {
                alert(`Package Selected!\n${packageName}\n${packagePrice}`);
                // Redirect to payment page or update UI (optional)
                // window.location.href = 'payment.html';
            })
            .catch(error => {
                alert(`Package Selection Failed: ${error}`);
            });
    });
});

// Payment Form Submission
document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting the traditional way

    // Get the phone number from the form
    const phoneNumber = document.getElementById('phoneNumber').value;

    // Simple validation
    if (!phoneNumber || phoneNumber.length !== 10 || !phoneNumber.startsWith('07')) {
        alert('Please enter a valid Kenyan phone number (e.g., 07XXXXXXXX).');
        return;
    }

    // Simulate M-PESA prompt
    simulateMpesaPrompt(phoneNumber)
        .then(response => {
            alert(`Payment Successful!\nM-PESA Code: ${response.mpesaCode}`);
            // Redirect to a success page or update UI (optional)
            // window.location.href = 'success.html';
        })
        .catch(error => {
            alert(`Payment Failed: ${error}`);
        });

    // Clear the form field (optional)
    document.getElementById('phoneNumber').value = '';
});

// Simulate a login request (mock backend)
function simulateLogin(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === "user" && password === "password") {
                resolve({ message: "Login successful" });
            } else {
                reject("Invalid username or password");
            }
        }, 1000); // Simulate a 1-second delay
    });
}

// Simulate a reconnect request (mock backend)
function simulateReconnect(mpesaCode) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (mpesaCode.length === 10) { // Example validation
                resolve({ message: "Reconnect successful" });
            } else {
                reject("Invalid M-PESA code");
            }
        }, 1000); // Simulate a 1-second delay
    });
}

// Simulate a package selection request (mock backend)
function simulatePackageSelection(packageName, packagePrice) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (packageName && packagePrice) {
                resolve({ message: "Package selected" });
            } else {
                reject("Invalid package selection");
            }
        }, 1000); // Simulate a 1-second delay
    });
}

// Simulate M-PESA prompt (mock backend)
function simulateMpesaPrompt(phoneNumber) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate a successful payment with a mock M-PESA code
            const mpesaCode = `MPESA${Math.floor(Math.random() * 1000000)}`; // Random M-PESA code
            if (phoneNumber) {
                resolve({ mpesaCode: mpesaCode, message: "Payment successful" });
            } else {
                reject("Payment failed: Invalid phone number");
            }
        }, 3000); // Simulate a 3-second delay (time for user to confirm payment on their phone)
    });
}
(async () => {
    try {
        const phoneNumber = '07XXXXXXXX'; // Customer's phone number
        const amount = '1000'; // Amount to be paid
        const businessShortCode = '174379'; // Your business shortcode
        const passkey = 'YOUR_PASSKEY'; // Your Lipa Na M-PESA passkey
        const callbackURL = 'https://yourdomain.com/callback'; // Your callback URL
        const consumerKey = 'YOUR_CONSUMER_KEY'; // Your API consumer key
        const consumerSecret = 'YOUR_CONSUMER_SECRET'; // Your API consumer secret

        const result = await initiateMpesaPayment(phoneNumber, amount, businessShortCode, passkey, callbackURL, consumerKey, consumerSecret);
        console.log('M-PESA Payment Initiated Successfully:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();