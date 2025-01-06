import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {  }); // Specify API version

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Request received at /api/checkout-sessions");
    console.log("Method:", req.method);

    if (req.method === 'POST') {
        try {
            const { cartItems } = req.body;
            console.log("Request Body: cartItems:", cartItems);

            // Validate cartItems:  More robust check
            if (!Array.isArray(cartItems) || cartItems.length === 0) {
                return res.status(400).json({ error: "Invalid cart items: Must be a non-empty array." });
            }

            // Map cart items to Stripe line items with improved error handling
            const lineItems = cartItems.map((item, index) => {
                // Validate item structure. Throw specific error for better debugging.
                if (!item.name || !item.price || !item.quantity || !item.description) {
                    throw new Error(`Invalid cart item at index ${index}: Missing required fields (name, price, quantity, description). Item: ${JSON.stringify(item)}`);
                }
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                            description: item.description,
                        },
                        unit_amount: Math.round(item.price * 100), //Round to handle potential floating-point issues
                    },
                    quantity: item.quantity,
                };
            });

            // Create the Stripe Checkout Session
            const session = await stripe.checkout.sessions.create({
                line_items: lineItems,
                mode: "payment",
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/cancel`,
                automatic_tax: { enabled: true }, // Requires Stripe configuration
            });

            console.log("Checkout Session created:", session.id);
            return res.status(200).json({ sessionId: session.id });
        } catch (error: any) {
            console.error("API Route Error:", error);
            // Return more informative error message.
            return res.status(500).json({ error: `Server Error: ${error.message || error}` });
        }
    } else {
        console.warn(`Method ${req.method} not allowed.`);
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
