'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="relative mb-3 h-48 w-full overflow-hidden rounded-lg">
        <Image src={product.image_url} alt={product.title} fill className="object-cover" />
      </div>
      <h2 className="text-lg font-semibold">{product.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold">{product.price.toFixed(2)} €</span>
        <span className="text-xs text-slate-500">Stock: {product.stock}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/product/${product.id}`}
          className="rounded border px-3 py-2 text-sm hover:bg-slate-100"
        >
          Voir
        </Link>
        <button
          type="button"
          onClick={() => addItem(product, 1)}
          className="rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500"
        >
          Ajouter
        </button>
      </div>
    </article>
  );
}
