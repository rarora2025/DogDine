const express = require('express');
const stripe = require('stripe')('sk_test_your_stripe_secret_key_here');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// PayPal configuration
const paypal = require('@paypal/checkout-server-sdk');
let environment = new paypal.core.SandboxEnvironment(
    'your_paypal_client_id',
    'your_paypal_client_secret'
);
let client = new paypal.core.PayPalHttpClient(environment);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Create Stripe payment intent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PayPal order capture
app.post('/capture-paypal-order', async (req, res) => {
    try {
        const { orderID } = req.body;
        
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        const order = await client.execute(request);
        
        res.json({
            orderID: order.result.id,
            status: order.result.status,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Handle order submission
app.post('/submit-order', async (req, res) => {
    try {
        const orderData = req.body;
        
        // Here you would typically:
        // 1. Save order to database
        // 2. Send confirmation email
        // 3. Update inventory
        // 4. Schedule delivery
        
        console.log('New order received:', orderData);
        
        res.json({
            success: true,
            orderId: 'DOG-' + Date.now(),
            message: 'Order submitted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`DogDine server running at http://localhost:${port}`);
    console.log('Make sure to update your PayPal and Stripe keys in the configuration!');
}); 