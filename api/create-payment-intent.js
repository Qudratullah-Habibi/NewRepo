// api/create-payment-intent.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Use your secret key from Vercel Env Variables

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { amount } = req.body; // Amount in cents (e.g., 500 = $5)
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'usd',
                automatic_payment_methods: { enabled: true },
            });

            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
