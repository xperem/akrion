// src/app/api/tools/[tool]/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface RequestBody {
  resultKey: string;
  answers: Record<string, 'yes' | 'no'>;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    const { tool } = await params;
    
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { resultKey, answers } = body;
    const productId = new URL(req.url).searchParams.get('product');

    if (!productId) return NextResponse.json({ error: 'missing productId' }, { status: 400 });
    if (!resultKey) return NextResponse.json({ error: 'missing resultKey' }, { status: 400 });
    if (!answers) return NextResponse.json({ error: 'missing answers' }, { status: 400 });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    // Mapping tool → colonne pour la rétrocompatibilité
    const FIELD_MAP = {
      qualification_dm: 'is_dm',
      regulation: 'regulation',
      class_rule11: 'mdr_class',
      software_safety: 'software_safety',
    } as const;

    const column = FIELD_MAP[tool as keyof typeof FIELD_MAP];
    if (!column) {
      return NextResponse.json({ error: `No mapping for tool '${tool}'` }, { status: 400 });
    }

    // Valeur pour la colonne existante (rétrocompatibilité)
    const value = tool === 'qualification_dm'
      ? resultKey === 'DM'
      : resultKey;

    // 1. D'abord, récupérer l'historique existant
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('tool_histories')
      .eq('id', productId)
      .eq('owner_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching product:', fetchError);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 2. Mettre à jour l'historique
    const currentHistories = product.tool_histories || {};
    const updatedHistories = {
      ...currentHistories,
      [tool]: {
        answers,
        resultKey,
        timestamp: new Date().toISOString()
      }
    };

    // 3. Sauvegarder à la fois la valeur et l'historique
    const { error } = await supabase
      .from('products')
      .update({ 
        [column]: value,
        tool_histories: updatedHistories
      })
      .eq('id', productId)
      .eq('owner_id', user.id);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    console.log('Update successful with history');
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}