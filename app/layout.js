import './globals.css';
import Header from '../components/Header';
import { CartProvider } from '../components/CartContext';

export const metadata = {
  title: 'NovaShop - Jamstack e-commerce',
  description: 'Boutique moderne Jamstack prête pour Netlify'
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Header />
          <main className="mx-auto min-h-screen max-w-6xl p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
