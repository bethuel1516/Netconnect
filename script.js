document.addEventListener('DOMContentLoaded', () => {
    // Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (!username || !password) return alert('Please fill in all fields.');

        alert(`Login Successful! Welcome, ${username}`);
        // Implement actual login authentication here
    });

    // Package Selection
    document.querySelectorAll('.selectPackage').forEach(button => {
        button.addEventListener('click', function() {
            const packagePrice = this.parentElement.getAttribute('data-price');
            document.getElementById('packagePrice').value = packagePrice;
            document.getElementById('paymentSection').style.display = 'block';
        });
    });

    // Payment Form Submission
    document.getElementById('paymentForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const packagePrice = document.getElementById('packagePrice').value;
        if (!/^07\d{8}$/.test(phoneNumber)) return alert('Enter a valid Kenyan phone number.');

        try {
            const response = await fetch('/initiate-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, amount: packagePrice })
            });
            const data = await response.json();
            if (data.success) alert('Payment initiated! Check your phone.');
            else alert('Payment failed: ' + data.error);
        } catch (error) {
            alert('Payment request error: ' + error.message);
        }
    });

    // Reconnect Form Submission
    document.getElementById('reconnectForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const mpesaCode = document.getElementById('mpesaCode').value.trim();
        if (!mpesaCode) return alert('Please enter your M-PESA code.');

        alert(`Reconnect Successful! Code: ${mpesaCode}`);
        // Implement actual reconnect verification here
    });
});
