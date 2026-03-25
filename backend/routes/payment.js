const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('your_stripe')) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.log('Stripe not configured. Running in demo payment mode.');
}

// Create payment intent
router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount.' });
    }

    // Demo mode if Stripe not configured
    if (!stripe) {
      return res.json({
        clientSecret: 'demo_payment_intent_secret',
        demo: true,
        message: 'Running in demo mode. No real payment will be processed.'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { userId: req.user.id.toString() }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Payment intent error:', err);
    res.status(500).json({ message: 'Payment failed. Please try again.' });
  }
});

// Get Stripe publishable key
router.get('/config', (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const isDemo = !publishableKey || publishableKey.includes('your_stripe');
  res.json({
    publishableKey: isDemo ? null : publishableKey,
    demo: isDemo
  });
});

module.exports = router;
