import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/akrion-app/login');
  }

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      created_at,
      description,
      intended_use,
      intended_user,
      intended_environment,
      patient_population,
      operation_principle
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  return <DashboardClient products={products!} />;
}
