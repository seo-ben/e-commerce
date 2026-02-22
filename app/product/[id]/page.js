'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '../../../components/CartContext';

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    fetch('/.netlify/functions/get-products')
      .then((res) => res.json())
      .then((data) => {
        const found = data.products.find((item) => String(item.id) === params.id);
        if (!found) throw new Error('Produit introuvable');
        setProduct(found);
      })
      .catch((err) => setError(err.message));
  }, [params.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Chargement...</p>;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative h-80 overflow-hidden rounded-xl bg-white">
        <Image src={product.image_url} alt={product.title} fill className="object-cover" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="mt-4 text-slate-700">{product.description}</p>
        <p className="mt-4 text-2xl font-semibold">{product.price.toFixed(2)} €</p>
        <p className="mt-1 text-sm text-slate-500">Stock disponible : {product.stock}</p>
        <button
          onClick={() => addItem(product, 1)}
          className="mt-6 rounded bg-indigo-600 px-4 py-2 text-white"
          type="button"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
