-- Extension utile pour générer des UUID (si nécessaire plus tard)
create extension if not exists "pgcrypto";

-- Table produits principale utilisée par le storefront et l'admin
create table if not exists public.products (
  id bigserial primary key,
  title text not null,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  image_url text not null,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);

-- Exemple de données de départ
insert into public.products (title, description, price, image_url, stock)
values
  ('Casque Audio Pro', 'Casque sans fil avec réduction de bruit active.', 199.99, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200', 14),
  ('Clavier Mécanique RGB', 'Clavier compact, switches hot-swappable.', 129.90, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1200', 22),
  ('Souris Ergonomique', 'Souris gaming ultra légère 26000 DPI.', 79.00, 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1200', 35)
on conflict do nothing;

-- RLS activée pour sécuriser la table
alter table public.products enable row level security;

-- Lecture publique pour le catalogue
create policy "public read products"
on public.products
for select
using (true);

-- Écriture réservée au service role (utilisé par Netlify Functions)
create policy "service role manage products"
on public.products
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
