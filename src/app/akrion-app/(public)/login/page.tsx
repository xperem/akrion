'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const router   = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setError(error.message);
    router.push('/akrion-app/dashboard');
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow">
        <h1 className="text-center text-2xl font-bold">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full rounded border px-3 py-2" placeholder="E‑mail"
                 type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full rounded border px-3 py-2" placeholder="Mot de passe"
                 type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded bg-indigo-600 py-2 text-white transition hover:bg-indigo-700">
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}
