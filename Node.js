const axios = require('axios');
const crypto = require('crypto');

// Function to generate the password
function generatePassword(businessShortCode, passkey, timestamp) {
    const data = `${businessShortCode}${passkey}${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
}

// Function to generate the timestamp
function generateTimestamp() {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3); // Format: YYYYMMDDHHmmss
}

// Function to fetch the access token
async function getAccessToken(consumerKey, consumerSecret) {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await axios.get('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    return response.data.access_token;
}

// Main function to initiate M-PESA payment
async function initiateMpesaPayment(phoneNumber, amount, businessShortCode, passkey, callbackURL, consumerKey, consumerSecret) {
    try {
        // Generate timestamp and password
        const timestamp = generateTimestamp();
        const password = generatePassword(businessShortCode, passkey, timestamp);

        // Fetch access token
        const accessToken = await getAccessToken(consumerKey, consumerSecret);

        // Make the STK Push request
        const response = await axios.post(
            'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: businessShortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: businessShortCode,
                PhoneNumber: phoneNumber,
                CallBackURL: callbackURL,
                AccountReference: 'NetConnect',
                TransactionDesc: 'WIFI Package Payment',
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error initiating M-PESA payment:', error.response ? error.response.data : error.message);
        throw new Error('Failed to initiate M-PESA payment');
    }
}

// Example usage
(async () => {
    try {
        const phoneNumber = '07XXXXXXXX'; // Replace with the customer's phone number
        const amount = '1000'; // Amount to be paid
        const businessShortCode = 'YOUR_BUSINESS_SHORTCODE'; // Replace with your business shortcode
        const passkey = 'YOUR_PASSKEY'; // Replace with your Lipa Na M-PESA passkey
        const callbackURL = 'https://yourdomain.com/callback'; // Replace with your callback URL
        const consumerKey = 'YOUR_CONSUMER_KEY'; // Replace with your API consumer key
        const consumerSecret = 'YOUR_CONSUMER_SECRET'; // Replace with your API consumer secret

        const result = await initiateMpesaPayment(phoneNumber, amount, businessShortCode, passkey, callbackURL, consumerKey, consumerSecret);
        console.log('M-PESA Payment Initiated Successfully:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();