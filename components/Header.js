'use client';

import Link from 'next/link';
import { useCart } from './CartContext';

export default function Header() {
  const { cartItems } = useCart();
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          NovaShop
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/auth" className="hover:text-indigo-600">
            Auth
          </Link>
          <Link href="/admin" className="hover:text-indigo-600">
            Admin
          </Link>
          <Link href="/cart" className="rounded bg-indigo-600 px-3 py-1.5 text-white">
            Panier ({count})
          </Link>
        </div>
      </nav>
    </header>
  );
}
