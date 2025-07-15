// app/akrion-app/logout/route.ts
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/akrion-app', process.env.NEXT_PUBLIC_SITE_URL));
}
