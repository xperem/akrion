'use client';
import { Product } from '@/types/akrion-app/product';

interface Props {
  products: Product[];
  selectedId: string | undefined;          // ⬅️ autorise undefined
  onSelect: (id: string) => void;
}

export default function ProductSelector({ products, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-2 p-4">
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id!)}
          className={`px-4 py-2 rounded ${
            p.id === selectedId ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
