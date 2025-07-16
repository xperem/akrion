// src/app/api/tools/[tool]/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Liste des outils — inchangée
const ALLOWED_TOOLS = [
  'qualification_dm',
  'risk_analysis',
  'clinical_evaluation',
  'technical_documentation',
] as const;
type AllowedTool = typeof ALLOWED_TOOLS[number];

interface RequestBody {
  resultKey: string;
  answers: Record<string, 'yes' | 'no'>;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tool: string }> }   // signature gardée
) {
  try {
    /* 1 – Paramètre de route ------------------------------------ */
    const { tool } = await params;
    console.log('Tool received:', tool);

    /* 2 – Body JSON --------------------------------------------- */
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { resultKey, answers } = body;

    /* productId via query --------------------------------------- */
    const productId = new URL(req.url).searchParams.get('product');
    console.log('Request body:', { resultKey, answers });
    console.log('Product ID from URL:', productId);

    /* validations courtes --------------------------------------- */
    if (!productId)  return NextResponse.json({ error: 'missing productId' }, { status: 400 });
    if (!resultKey)  return NextResponse.json({ error: 'missing resultKey' }, { status: 400 });
    if (!answers)    return NextResponse.json({ error: 'missing answers'  }, { status: 400 });

    /* 3 – Auth Supabase ----------------------------------------- */
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    /* 4 – Mapping tool → colonne + update ----------------------- */
    const FIELD_MAP = {
      qualification_dm:  'is_dm',
      regulation:        'regulation',
      class_rule11:      'mdr_class',
      software_safety:   'software_safety',
    } as const;

    const column = FIELD_MAP[tool as keyof typeof FIELD_MAP];
    if (!column) {
      return NextResponse.json({ error: `No mapping for tool '${tool}'` }, { status: 400 });
    }

    /* Conversion : DM → true, sinon → false pour is_dm ----------- */
    const value = tool === 'qualification_dm'
      ? resultKey === 'DM'            // DM ➜ true ; NOT_DM (ou autre) ➜ false
      : resultKey;                    // autres outils : garder la chaîne

    const { error } = await supabase
      .from('products')
      .update({ [column]: value })    // on écrit la bonne valeur
      .eq('id', productId)
      .eq('owner_id', user.id);       // sécurité

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 });
    }

    console.log('Update successful');
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
