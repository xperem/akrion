import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  await supabase.from('products').delete().eq('id', id);

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const supabase = await createClient();
  await supabase.from('products').update(body).eq('id', id);

  return NextResponse.json({ ok: true });
}