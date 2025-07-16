// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const supabase = await createClient();
  const { id } = context.params;

  await supabase.from('products').delete().eq('id', id);

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json(); // { name?, description?, ... }
  const supabase = await createClient();
  await supabase.from('products').update(body).eq('id', params.id);
  return NextResponse.json({ ok: true });
}
