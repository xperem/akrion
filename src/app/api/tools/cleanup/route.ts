// app/api/tools/cleanup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Parsing du body
    const body = await request.json();
    const { productId } = body;

    // Validation du productId
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      return NextResponse.json({ 
        error: 'Product ID requis et doit être une chaîne non vide'
      }, { status: 400 });
    }

    const cleanProductId = productId.trim();

    // Récupérer les données actuelles du produit
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('tool_histories, is_dm')
      .eq('id', cleanProductId)
      .eq('owner_id', user.id)
      .single();

    if (fetchError) {
      return NextResponse.json({ 
        error: 'Erreur lors de la recherche du produit',
        details: fetchError.message 
      }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    // Logique de nettoyage
    let cleanedHistories = product.tool_histories || {};
    let cleanupActions: string[] = [];

    if (product.is_dm === false) {
      const dmHistory = cleanedHistories['qualification_dm'];
      const otherTools = Object.keys(cleanedHistories).filter(k => k !== 'qualification_dm');
      
      if (dmHistory && otherTools.length > 0) {
        cleanedHistories = { qualification_dm: dmHistory };
        cleanupActions = [`Supprimé ${otherTools.length} outil(s): ${otherTools.join(', ')}`];
      }
    }

    // Mettre à jour en base si nécessaire
    if (cleanupActions.length > 0) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          tool_histories: cleanedHistories,
          regulation: null,
          mdr_class: null,
          software_safety: null
        })
        .eq('id', cleanProductId)
        .eq('owner_id', user.id);

      if (updateError) {
        return NextResponse.json({ 
          error: 'Erreur lors du nettoyage',
          details: updateError.message 
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      actions: cleanupActions,
      cleanedHistories,
      productId: cleanProductId
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Erreur serveur interne',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}