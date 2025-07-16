// components/akrion-app/EmptyState.tsx
'use client';

import { Package, PlusCircle } from 'lucide-react';
import { ProductDrawer } from '@/components/akrion-app/Dashboard/ProductDrawer';
import { Button } from '@/components/ui/button';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Package className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-semibold">0</span>
        </div>
      </div>
      
      <div className="space-y-3 mb-8">
        <h2 className="text-xl font-bold text-gray-900">
          Aucun produit pour l'instant
        </h2>
        <p className="text-gray-600 max-w-md">
          Créez votre premier produit pour commencer à utiliser nos outils d'analyse réglementaire.
        </p>
      </div>

      <ProductDrawer mode="create">
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all">
          <PlusCircle className="h-5 w-5" />
          Créer mon premier produit
        </Button>
      </ProductDrawer>
    </div>
  );
}