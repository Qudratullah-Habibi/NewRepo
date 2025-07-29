// This file runs on the server side only in Vercel
import Stripe from 'stripe';

/**
 * Stripe secret key is read from environment variables (backend only)
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: 'Payment creation failed' });
    }
}
