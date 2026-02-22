const Stripe = require('stripe');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items } = JSON.parse(event.body || '{}');

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Panier vide' }) };
    }

    const origin = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:8888';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.title,
            description: item.description || ''
          }
        }
      })),
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/cart`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id, url: session.url })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  }
};
