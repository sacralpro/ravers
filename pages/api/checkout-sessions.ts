import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("Request received at /api/checkout-sessions");
    console.log("Method:", req.method);

    if (req.method === 'POST') {
        try {
            const { cartItems } = req.body; // Получаем данные из тела запроса
            console.log("Request Body: cartItems:", cartItems);

            // Проверка структуры cartItems
            if (!Array.isArray(cartItems) || cartItems.length === 0) {
                console.error("Invalid cartItems provided. Must be a non-empty array.");
                return res.status(400).json({ error: "Invalid cart items: Must be a non-empty array." });
            }

            const lineItems = cartItems.map(item => {
                console.log("Processing cart item:", item);
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                            description: item.description, // Add description to product data
                        },
                        unit_amount: item.price * 100, // Конвертируем доллары в центы
                    },
                    quantity: item.quantity,
                };
            });

            // Создание сессии для оплаты
            const session = await stripe.checkout.sessions.create({
                line_items: lineItems,
                mode: "payment",
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/cancel`,
                automatic_tax: { enabled: true },
            });

            console.log("Checkout Session created:", session.id);
            return res.status(200).json({ sessionId: session.id });
        } catch (error: any) {
            console.error("API Route Error:", error);
            return res.status(500).json({ error: "Server Error: " + (error.message || error) });
        }
    } else {
        console.warn(`Method ${req.method} not allowed.`);
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
