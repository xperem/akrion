import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { NextRequest } from 'next/server';
import type { RouteHandlerContext } from 'next/dist/server/web/types'; // <- nécessaire

export async function DELETE(
  req: NextRequest,
  context: RouteHandlerContext<{ id: string }>
) {
  const supabase = await createClient();
  const { id } = context.params;

  await supabase.from('products').delete().eq('id', id);

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  context: RouteHandlerContext<{ id: string }>
) {
  const body = await req.json();
  const supabase = await createClient();

  await supabase.from('products').update(body).eq('id', context.params.id);

  return NextResponse.json({ ok: true });
}
