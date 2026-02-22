'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    if (!supabase) {
      setMessage('Configuration Supabase manquante. Vérifiez les variables NEXT_PUBLIC_.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setMessage(error ? error.message : 'Compte créé. Vérifiez votre email.');
  };

  const signIn = async () => {
    if (!supabase) {
      setMessage('Configuration Supabase manquante. Vérifiez les variables NEXT_PUBLIC_.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMessage(error ? error.message : 'Connexion réussie.');
  };

  return (
    <section className="mx-auto max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold">Authentification</h1>
      <input
        className="mb-3 w-full rounded border p-2"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-3 w-full rounded border p-2"
        placeholder="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={signUp}
          disabled={loading}
          className="rounded bg-indigo-600 px-3 py-2 text-white"
        >
          Inscription
        </button>
        <button
          type="button"
          onClick={signIn}
          disabled={loading}
          className="rounded bg-slate-800 px-3 py-2 text-white"
        >
          Login
        </button>
      </div>
      {message ? <p className="mt-4 text-sm">{message}</p> : null}
    </section>
  );
}
