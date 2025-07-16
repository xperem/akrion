'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

import { ProductCard } from '@/components/akrion-app/ProductCard';
import { ProductDrawer } from '@/components/akrion-app/ProductDrawer';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/akrion-app/product';            // ← type centralisé

type Props = { products: (Product & { id: string })[] }; // id obligatoire

export default function DashboardClient({ products }: Props) {
  const [editing, setEditing]       = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasProducts = products.length > 0;

  return (
    <div className="space-y-10 px-8 py-10">
      {/* ---------- En‑tête ---------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Mes produits</h1>

        {hasProducts && (
          <ProductDrawer mode="create">
            <Button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700">
              <PlusCircle className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </ProductDrawer>
        )}
      </div>

      {/* ---------- Liste ou CTA ---------- */}
      {hasProducts ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name ?? 'Sans nom'}
              createdAt={
                p.created_at
                  ? new Date(p.created_at).toLocaleDateString('fr-FR')
                  : '—'
              }
              onEdit={() => {
                setEditing(p);
                setDrawerOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Aucun produit pour l’instant
          </h2>

          <ProductDrawer mode="create">
            <Button size="lg" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-lg hover:bg-indigo-700">
              <PlusCircle className="h-5 w-5" />
              Créer mon premier produit
            </Button>
          </ProductDrawer>
        </div>
      )}

      {/* ---------- Drawer d’édition ---------- */}
      {editing && (
        <ProductDrawer
          mode="edit"
          product={editing}
          open={drawerOpen}
          setOpen={(v) => {
            if (!v) setEditing(null);
            setDrawerOpen(v);
          }}
          triggerClassName="hidden"
        />
      )}
    </div>
  );
}
