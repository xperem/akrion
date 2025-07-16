// app/akrion-app/(protected)/products/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/akrion-app/login');

  await supabase.from('products').insert({
    id: crypto.randomUUID(),
    owner_id: user.id,
    name: formData.get('name') as string,
    description: formData.get('description') as string,
  });

  redirect('/akrion-app/dashboard');
}
