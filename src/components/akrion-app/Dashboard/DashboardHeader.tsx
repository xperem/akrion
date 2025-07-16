// components/akrion-app/DashboardHeader.tsx
'use client';

import { PlusCircle, Package, Calendar } from 'lucide-react';
import { ProductDrawer } from '@/components/akrion-app/Dashboard/ProductDrawer';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/akrion-app/product';

interface DashboardHeaderProps {
  products: (Product & { id: string })[];
  hasProducts: boolean;
}

export function DashboardHeader({ products, hasProducts }: DashboardHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Mes Produits
              </h1>
              <p className="text-gray-600 text-sm">
                Gérez vos dispositifs médicaux et leurs analyses
              </p>
            </div>
          </div>
          
          {hasProducts && (
            <ProductDrawer mode="create">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
                <PlusCircle className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </ProductDrawer>
          )}
        </div>

        {/* Stats rapides */}
        {hasProducts && (
          <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{products.length}</div>
                  <div className="text-xs text-gray-600">Produits</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">
                    {products.filter(p => p.created_at && new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-xs text-gray-600">Cette semaine</div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  Dernière modification : {products[0]?.created_at 
                    ? new Date(products[0].created_at).toLocaleDateString('fr-FR')
                    : '—'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}