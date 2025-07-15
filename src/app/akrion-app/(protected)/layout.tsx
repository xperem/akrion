// app/akrion-app/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';

type Props = { children: ReactNode };

export default async function ProtectedLayout({ children }: Props) {
  /* ─── Vérification de session ─── */
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/akrion-app/login');

  /* ─── Mise en page protégée sans header ─── */
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
      <main className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-4xl rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
