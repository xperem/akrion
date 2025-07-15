// app/akrion-app/(protected)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/akrion-app/login');

  const name = user.user_metadata?.display_name || user.email;

  return (
    <section className="px-4 py-10">
      <h1 className="break-words text-xl sm:text-2xl font-semibold">
        Bienvenue sur Akrion App, {name} 👋
      </h1>
    </section>
  );
}
