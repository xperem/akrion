// app/akrion-app/(protected)/tools/page.tsx
import { createClient }  from '@/lib/supabase/server';
import ProductToolsShell from './ProductToolsShell';
import { Product }       from '@/types/akrion-app/product';

export default async function ToolsPage() {
  const supabase = await createClient();

  /* produits + colonnes résultats ---------------------------------- */
  const { data: productsRaw } = await supabase
    .from('products')
    .select('id, name, is_dm, regulation, mdr_class, software_safety')
    .order('created_at');

  const products: Product[] = productsRaw?.map(p => ({
    id: p.id,
    name: p.name,
  })) ?? [];

  if (!products.length) {
    return <p className="p-10 text-xl">Aucun produit – créez‑en un dans le Dashboard</p>;
  }

  /* résultats par produit ------------------------------------------ */
  const initialResultsByProduct: Record<string, {
    tool: string;
    result: { answers: Record<string, 'yes' | 'no'>; resultKey: string };
  }[]> = {};

  for (const p of productsRaw!) {
    const results = [];

    if (typeof p.is_dm === 'boolean') {
      results.push({
        tool: 'qualification_dm',
        result: {
          resultKey: p.is_dm ? 'DM' : 'NOT_DM',
          answers: {}, // tu peux stocker les réponses si tu veux les gérer
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

    initialResultsByProduct[p.id] = results;
  }

  return (
    <ProductToolsShell
      products={products}
      initialResultsByProduct={initialResultsByProduct}
    />
  );
}
