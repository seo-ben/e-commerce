'use client';

import { useEffect, useState } from 'react';

const emptyForm = {
  id: '',
  title: '',
  description: '',
  price: '',
  image_url: '',
  stock: ''
};

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const loadProducts = async () => {
    const res = await fetch('/.netlify/functions/get-products');
    const data = await res.json();
    setProducts(data.products || []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const saveProduct = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    const res = await fetch('/.netlify/functions/upsert-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message || 'Erreur lors de la sauvegarde');
      return;
    }

    setMessage('Produit sauvegardé ✅');
    setForm(emptyForm);
    await loadProducts();
  };

  const editProduct = (product) => setForm({ ...product, id: String(product.id) });

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">Admin produits</h1>
        <form onSubmit={saveProduct} className="space-y-3">
          <input
            className="w-full rounded border p-2"
            placeholder="ID (laisser vide pour création)"
            value={form.id}
            onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Titre"
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            className="w-full rounded border p-2"
            placeholder="Description"
            required
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Prix"
            type="number"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Image URL"
            required
            value={form.image_url}
            onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
          />
          <input
            className="w-full rounded border p-2"
            placeholder="Stock"
            type="number"
            required
            value={form.stock}
            onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
          />
          <button type="submit" className="rounded bg-indigo-600 px-4 py-2 text-white">
            Sauvegarder
          </button>
        </form>
        {message ? <p className="mt-3 text-sm">{message}</p> : null}
      </div>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Produits existants</h2>
        <ul className="space-y-2">
          {products.map((product) => (
            <li key={product.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium">{product.title}</p>
                <p className="text-sm text-slate-500">{product.price.toFixed(2)} €</p>
              </div>
              <button
                type="button"
                onClick={() => editProduct(product)}
                className="text-sm text-indigo-600"
              >
                Éditer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
