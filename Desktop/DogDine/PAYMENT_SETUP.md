# Payment Setup Guide for DogDine

This guide will help you set up PayPal and Stripe payments for your DogDine website.

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Payment Keys** (see sections below)

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Access your website**
   Open `http://localhost:3000` in your browser

## 💳 PayPal Setup

### 1. Create PayPal Developer Account
- Go to [PayPal Developer Portal](https://developer.paypal.com/)
- Sign up for a developer account
- Navigate to "Apps & Credentials"

### 2. Create PayPal App
- Click "Create App"
- Name it "DogDine"
- Select "Business" account type
- Choose "Web" platform

### 3. Get Your Keys
- Copy the **Client ID** and **Client Secret**
- Update `server.js` with your keys:
  ```javascript
  let environment = new paypal.core.SandboxEnvironment(
      'YOUR_PAYPAL_CLIENT_ID',
      'YOUR_PAYPAL_CLIENT_SECRET'
  );
  ```

### 4. Update Frontend
- In `index.html`, update the PayPal SDK script:
  ```html
  <script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD"></script>
  ```

## 💳 Stripe Setup

### 1. Create Stripe Account
- Go to [Stripe Dashboard](https://dashboard.stripe.com/)
- Sign up for an account
- Complete your business verification

### 2. Get Your Keys
- In Stripe Dashboard, go to "Developers" → "API keys"
- Copy your **Publishable key** and **Secret key**

### 3. Update Backend
- In `server.js`, update the Stripe secret key:
  ```javascript
  const stripe = require('stripe')('sk_test_YOUR_STRIPE_SECRET_KEY');
  ```

### 4. Update Frontend
- In `script.js`, update the Stripe publishable key:
  ```javascript
  const stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');
  ```

## 🔧 Environment Variables (Recommended)

Create a `.env` file in your project root:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

Then update `server.js` to use environment variables:

```javascript
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

let environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
```

## 🧪 Testing

### PayPal Testing
- Use PayPal Sandbox accounts for testing
- Create test accounts in PayPal Developer Portal
- Test with these credentials:
  - Email: `sb-1234567890@business.example.com`
  - Password: `test123`

### Stripe Testing
- Use Stripe test card numbers:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - Expiry: Any future date
  - CVC: Any 3 digits

## 🚀 Production Deployment

### 1. Switch to Production Keys
- PayPal: Use Live environment instead of Sandbox
- Stripe: Use Live keys instead of test keys

### 2. Update Environment
```javascript
// PayPal Production
let environment = new paypal.core.LiveEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);

// Stripe Production
const stripe = require('stripe')(process.env.STRIPE_LIVE_SECRET_KEY);
```

### 3. Deploy to Hosting Service
- **Heroku**: `git push heroku main`
- **Vercel**: Connect your GitHub repository
- **Netlify**: Upload files and set up serverless functions

## 🔒 Security Notes

1. **Never expose secret keys** in frontend code
2. **Use HTTPS** in production
3. **Validate all inputs** on both frontend and backend
4. **Implement webhook verification** for production
5. **Store sensitive data** in environment variables

## 📞 Support

- **PayPal Developer Support**: [PayPal Developer Docs](https://developer.paypal.com/docs/)
- **Stripe Support**: [Stripe Documentation](https://stripe.com/docs)
- **General Issues**: Check the console for error messages

## 🎯 Next Steps

1. Set up order management system
2. Implement email notifications
3. Add inventory tracking
4. Set up delivery scheduling
5. Add customer account management

---

**Remember**: Always test thoroughly in sandbox/test mode before going live! 