'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';   // ⬅️ helper qui retourne createBrowserClient()

export default function RegisterPage() {
  const supabase = createClient();          // nouvelle instance côté client
  const router   = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    // Nettoie le formulaire
    setEmail('');
    setPassword('');

    // Redirige et force le layout serveur à refetch la session
    router.push('/akrion-app/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <h1 className="mb-2 text-center text-2xl font-bold">Créer un compte</h1>

        <input
          type="email"
          placeholder="E‑mail"
          className="w-full rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full rounded border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button className="w-full rounded bg-indigo-600 py-2 text-white transition hover:bg-indigo-700">
          S’inscrire
        </button>
      </form>
    </main>
  );
}
