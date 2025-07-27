// server.js
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe("sk_test_51RpQzTHp3WyVTDjVJvSeUFR22Zq3NdaymygXmwGM1y4Zp2h2eVpLj8XfSNHN0aQLtfE4FHSppLLstprVYRA6SIG800dZs86PnX"); // Replace with your secret key

app.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount } = req.body; // amount in cents
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.listen(4242, () => console.log("Server running on http://localhost:4242"));
