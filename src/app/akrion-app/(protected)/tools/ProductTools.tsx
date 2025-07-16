'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import ToolTimeline from '@/components/akrion-app/ToolTimeline';

type Product = { id: string; name: string | null };
type StoredResult = {
  tool: string;
  result: {
    answers: Record<string, 'yes' | 'no'>;
    resultKey: string;
  };
};

export default function ProductTools({
  products,
  activeId,
  results,
}: {
  products: Product[];
  activeId: string;
  results: StoredResult[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  function handleChange(id: string) {
    const sp = new URLSearchParams(params);
    sp.set('product', id);
    router.replace(`/akrion-app/tools?${sp.toString()}`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-10">
      {/* ---- header ---- */}
      <header className="flex flex-wrap items-center gap-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Outils réglementaires
        </h1>

        {/* sélecteur produit */}
        <Select value={activeId} onValueChange={handleChange}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Choisir un produit" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name ?? 'Sans nom'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      {/* ---- timeline / workflow ---- */}
      <ToolTimeline 
        key={activeId} // Cette ligne force le remount du composant
        productId={activeId} 
        initialResults={results} 
      />
    </div>
  );
}