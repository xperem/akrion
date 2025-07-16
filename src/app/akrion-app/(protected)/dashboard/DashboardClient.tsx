'use client';

import { useState } from 'react';
import { PlusCircle, Package, Calendar, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

import { ProductCard } from '@/components/akrion-app/ProductCard';
import { ProductDrawer } from '@/components/akrion-app/ProductDrawer';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/akrion-app/product';
import { useRouter } from 'next/navigation';

type Props = { products: (Product & { id: string })[] };

export default function DashboardClient({ products }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const hasProducts = products.length > 0;

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Recharger la page pour mettre à jour la liste
        window.location.reload();
      } else {
        alert('Erreur lors de la suppression du produit');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleViewTools = (productId: string) => {
    router.push(`/akrion-app/tools?product=${productId}`);
  };

  return (
    <div className="min-h-screen" data-full-height>
      {/* Header unifié */}
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

      {/* Contenu principal */}
      <main className="px-6 py-6">
        {hasProducts ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/60 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {product.name || 'Sans nom'}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {product.created_at
                            ? new Date(product.created_at).toLocaleDateString('fr-FR')
                            : '—'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditing(product);
                          setDrawerOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Description si disponible */}
                  {product.description && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  {/* Actions principales */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewTools(product.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                    >
                      Analyser
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </main>

      {/* Drawer d'édition */}
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