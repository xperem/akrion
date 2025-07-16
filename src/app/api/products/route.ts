// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  // 1. Récupère le formulaire
  const fd = await req.formData();

  // 2. Vérifie l’utilisateur
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauth' }, { status: 401 });
  }

  // 3. Extrait les champs
  const name                 = fd.get('name')                 as string | null;
  const description          = fd.get('description')          as string | null;
  const intendedUse          = fd.get('intended_use')         as string | null;
  const intendedUser         = fd.get('intended_user')        as string | null;
  const intendedEnvironment  = fd.get('intended_environment') as string | null;
  const patientPopulation    = fd.get('patient_population')   as string | null;
  const operationPrinciple   = fd.get('operation_principle')  as string | null;

  if (!name) {
    return NextResponse.json({ error: 'missing name' }, { status: 400 });
  }

  // 4. Insert avec les bons noms de colonnes
  const { error } = await supabase.from('products').insert({
    owner_id:            user.id,
    name,
    description,
    intended_use:        intendedUse,
    intended_user:       intendedUser,
    intended_environment:intendedEnvironment,
    patient_population:  patientPopulation,
    operation_principle: operationPrinciple,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
