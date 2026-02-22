# NovaShop — E-commerce Jamstack (Next.js + Netlify + Supabase + Stripe)

## Vue d'ensemble de l'architecture

Ce projet applique une architecture **Jamstack** :

- **Frontend statique/hybride** avec **Next.js + Tailwind CSS** (UI rapide, SEO-friendly, composants réutilisables).
- **API serverless** via **Netlify Functions** pour isoler la logique métier sensible (Stripe, accès Supabase service role).
- **Base de données + Auth** via **Supabase** :
  - table `products` pour le catalogue,
  - `Supabase Auth` pour inscription/connexion.
- **Paiement Stripe Checkout** :
  - création de session côté function serverless,
  - redirection Stripe,
  - retour sur page de confirmation.
- **Déploiement Netlify** :
  - build Next.js,
  - fonctions dans `netlify/functions/`,
  - variables d'environnement configurées dans l'UI Netlify.

---

## 1) Arborescence complète du projet

```bash
.
├── app/
│   ├── admin/page.js
│   ├── auth/page.js
│   ├── cart/page.js
│   ├── checkout/success/page.js
│   ├── product/[id]/page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── CartContext.js
│   ├── Header.js
│   └── ProductCard.js
├── lib/
│   ├── api.js
│   ├── stripeClient.js
│   └── supabaseClient.js
├── netlify/functions/
│   ├── add-to-cart.js
│   ├── create-checkout-session.js
│   ├── get-products.js
│   └── upsert-product.js
├── supabase/
│   └── schema.sql
├── .env.example
├── netlify.toml
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
└── README.md
```

---

## 2) Frontend inclus

- **Page d'accueil** (liste produits) : `app/page.js`
- **Page produit** : `app/product/[id]/page.js`
- **Panier + checkout** : `app/cart/page.js` + `app/checkout/success/page.js`
- **Authentification** (inscription/login) : `app/auth/page.js`
- **Dashboard admin simplifié** (ajout/édition produit) : `app/admin/page.js`

---

## 3) Fonctions serverless Netlify incluses

- `get-products.js` : récupère les produits Supabase
- `add-to-cart.js` : valide produit + stock avant ajout
- `create-checkout-session.js` : crée une session Stripe Checkout
- `upsert-product.js` : ajoute/édite un produit (support admin)

---

## 4) Intégration Stripe

Flux checkout :
1. L'utilisateur clique « Payer avec Stripe » dans `app/cart/page.js`.
2. Frontend appelle `/.netlify/functions/create-checkout-session`.
3. Function crée une session Stripe avec `STRIPE_SECRET_KEY`.
4. Frontend redirige vers Stripe Checkout via `redirectToCheckout`.
5. Stripe redirige vers `/checkout/success` en cas de succès.

---

## 5) Script SQL Supabase

Le script est disponible ici :

- `supabase/schema.sql`

Il crée la table `products`, active la RLS, ajoute les policies et injecte des produits de démonstration.

---

## 6) Déploiement complet Netlify + config Stripe + Supabase

## Prérequis

- Node.js 18+
- Un projet Supabase
- Un compte Stripe
- Un compte Netlify

## Installation locale

```bash
npm install
cp .env.example .env.local
```

Renseigner `.env.local` :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `URL=http://localhost:8888` (optionnel en local)

Puis démarrer :

```bash
npm run dev
```

## Configuration Supabase

1. Créez un projet Supabase.
2. Exécutez `supabase/schema.sql` dans SQL Editor.
3. Activez Email/Password dans `Authentication > Providers`.
4. Récupérez :
   - URL du projet,
   - anon key,
   - service role key.

## Configuration Stripe

1. Créez un produit (optionnel, ici les line items sont dynamiques).
2. Récupérez :
   - `Publishable key` (frontend),
   - `Secret key` (Netlify Functions).
3. En test mode, utilisez la carte : `4242 4242 4242 4242`.

## Déployer sur Netlify

1. Poussez le repo sur GitHub/GitLab/Bitbucket.
2. Dans Netlify : **Add new site** > Import from Git.
3. Build settings (déjà dans `netlify.toml`) :
   - Build command : `npm run build`
   - Publish directory : `.next`
   - Functions directory : `netlify/functions`
4. Ajoutez les variables d'environnement dans **Site settings > Environment variables**.
5. Déployez.

> Le plugin `@netlify/plugin-nextjs` est déjà déclaré pour supporter Next.js sur Netlify.

## Tester les paiements Stripe

1. Ajoutez des produits au panier.
2. Cliquez sur « Payer avec Stripe ».
3. Utilisez une carte de test Stripe (ex : `4242 4242 4242 4242`, date future, CVC 123).
4. Vérifiez la redirection vers `/checkout/success`.
5. Vérifiez la session dans le dashboard Stripe (mode test).

---

## Notes sécurité

- **Ne jamais** exposer `STRIPE_SECRET_KEY` ni `SUPABASE_SERVICE_ROLE_KEY` côté frontend.
- Toutes les opérations sensibles sont gérées côté Netlify Functions.
- Pour production, ajouter un contrôle d'accès admin robuste (claims JWT/role Supabase).
