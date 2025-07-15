// app/akrion-app/dashboard/page.tsx
import { createClient as createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/akrion-app/login');

  return (
    <div className="px-4 py-10">
      <h1 className="text-2xl">Bienvenue, {user.email} 👋</h1>
    </div>
  );
}
