export async function fetchProducts() {
  const res = await fetch('/.netlify/functions/get-products');
  if (!res.ok) {
    throw new Error('Impossible de récupérer les produits');
  }
  return res.json();
}

export async function addToCartAPI(productId, quantity = 1) {
  const res = await fetch('/.netlify/functions/add-to-cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erreur panier');
  }

  return res.json();
}

export async function createCheckoutSession(cartItems) {
  const res = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cartItems })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erreur checkout');
  }

  return res.json();
}
