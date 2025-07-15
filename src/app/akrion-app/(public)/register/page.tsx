'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const supabase = createClient();
  const router   = useRouter();

  // états du formulaire
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');

  /** Inscription */
  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }, // stocké dans user_metadata
    });

    if (error) return setError(error.message);

    router.push('/akrion-app/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 pt-[12vh]">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm space-y-6 rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-lg"
      >
        <h1 className="text-center text-2xl font-bold">Créer un compte</h1>

        <input
          type="text"
          placeholder="Nom d’affichage"
          className="w-full rounded-lg border px-3 py-2 focus:border-indigo-600 focus:outline-none"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="E‑mail"
          className="w-full rounded-lg border px-3 py-2 focus:border-indigo-600 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full rounded-lg border px-3 py-2 focus:border-indigo-600 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          S’inscrire
        </button>
      </form>
    </main>
  );
}
