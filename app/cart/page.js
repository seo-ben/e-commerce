'use client';

import { useState } from 'react';
import { useCart } from '../../components/CartContext';
import { createCheckoutSession } from '../../lib/api';
import { getStripe } from '../../lib/stripeClient';

export default function CartPage() {
  const { cartItems, removeItem, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');
      const { sessionId } = await createCheckoutSession(cartItems);
      const stripe = await getStripe();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Panier</h1>
      {cartItems.length === 0 ? <p>Votre panier est vide.</p> : null}
      <ul className="space-y-3">
        {cartItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded border bg-white p-4">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-slate-600">
                {item.quantity} x {item.price.toFixed(2)} €
              </p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              type="button"
              className="text-sm text-red-600"
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded border bg-white p-4">
        <p className="text-lg font-bold">Total : {total.toFixed(2)} €</p>
        <button
          onClick={handleCheckout}
          disabled={loading || cartItems.length === 0}
          type="button"
          className="mt-4 rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Redirection...' : 'Payer avec Stripe'}
        </button>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
    </section>
  );
}
