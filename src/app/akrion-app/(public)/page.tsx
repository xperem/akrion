// app/akrion-app/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LandingClient from './LandingClient';

export default async function AkrionAppPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    // Log facultatif — à retirer en prod si pas utile
   
  }

  if (data?.user) {
    redirect('/akrion-app/dashboard');
  }

  return <LandingClient />;
}
