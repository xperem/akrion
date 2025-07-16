// src/app/akrion-app/(protected)/tools/page.tsx
import { createClient }  from '@/lib/supabase/server';
import ProductToolsShell from './ProductToolsShell';
import { Product }       from '@/types/akrion-app/product';

export default async function ToolsPage() {
  const supabase = await createClient();

  /* Récupérer produits avec l'historique complet */
  const { data: productsRaw } = await supabase
    .from('products')
    .select('id, name, is_dm, regulation, mdr_class, software_safety, tool_histories')
    .order('created_at');

  const products: Product[] = productsRaw?.map(p => ({
    id: p.id,
    name: p.name,
  })) ?? [];

  /* Construire les résultats à partir de l'historique OU des colonnes legacy */
  const initialResultsByProduct: Record<string, {
    tool: string;
    result: { answers: Record<string, 'yes' | 'no'>; resultKey: string };
  }[]> = {};

  for (const p of productsRaw || []) {
    const results = [];

    // Si on a l'historique complet, l'utiliser en priorité
    if (p.tool_histories) {
      const histories = p.tool_histories as Record<string, any>;
      
      for (const [toolId, history] of Object.entries(histories)) {
        if (history && history.answers && history.resultKey) {
          results.push({
            tool: toolId,
            result: {
              answers: history.answers,
              resultKey: history.resultKey
            }
          });
        }
      }
    } else {
      // Fallback : utiliser les colonnes legacy (sans historique des réponses)
      if (typeof p.is_dm === 'boolean') {
        results.push({
          tool: 'qualification_dm',
          result: {
            resultKey: p.is_dm ? 'DM' : 'NOT_DM',
            answers: {}, // Pas d'historique disponible
          }
        });
      }

      if (p.regulation) {
        results.push({
          tool: 'regulation',
          result: {
            resultKey: p.regulation,
            answers: {},
          }
        });
      }

      if (p.mdr_class) {
        results.push({
          tool: 'class_rule11',
          result: {
            resultKey: p.mdr_class,
            answers: {},
          }
        });
      }

      if (p.software_safety) {
        results.push({
          tool: 'software_safety',
          result: {
            resultKey: p.software_safety,
            answers: {},
          }
        });
      }
    }

    initialResultsByProduct[p.id] = results;
  }

  return (
    <ProductToolsShell
      products={products}
      initialResultsByProduct={initialResultsByProduct}
    />
  );
}