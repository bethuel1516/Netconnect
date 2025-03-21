const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

function generatePassword(businessShortCode, passkey, timestamp) {
    return Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString('base64');
}

function generateTimestamp() {
    return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
}

async function getAccessToken() {
    try {
        const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
        const response = await axios.get('https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw new Error('Failed to get access token');
    }
}

async function initiateMpesaPayment(phoneNumber, amount) {
    try {
        const timestamp = generateTimestamp();
        const password = generatePassword(process.env.BUSINESS_SHORTCODE, process.env.PASSKEY, timestamp);
        const accessToken = await getAccessToken();

        const response = await axios.post(
            'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: process.env.BUSINESS_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: phoneNumber,
                PartyB: process.env.BUSINESS_SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: process.env.CALLBACK_URL,
                AccountReference: 'NetConnect',
                TransactionDesc: 'WIFI Package Payment',
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        return response.data;
    } catch (error) {
        console.error('Error initiating M-PESA payment:', error.response ? error.response.data : error.message);
        throw new Error('Failed to initiate payment');
    }
}

module.exports = { initiateMpesaPayment };
