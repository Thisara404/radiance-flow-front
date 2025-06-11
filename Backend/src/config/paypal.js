const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Creating an environment
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment;
if (process.env.PAYPAL_MODE === 'live') {
  environment = new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
} else {
  environment = new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

module.exports = { client };