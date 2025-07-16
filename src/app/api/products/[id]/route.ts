// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }          // ✅ match Next.js signature
) {
  const supabase = await createClient();
  await supabase.from('products').delete().eq('id', params.id);

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const supabase = await createClient();
  await supabase.from('products').update(body).eq('id', params.id);

  return NextResponse.json({ ok: true });
}
