// components/akrion-app/ProductGridItem.tsx
'use client';

import { Package, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Product } from '@/types/akrion-app/product';

interface ProductGridItemProps {
  product: Product & { id: string };
  onEdit: (product: Product) => void;
  onDelete: (productId: string, productName: string) => void;
  onViewTools: (productId: string) => void;
}

export function ProductGridItem({ 
  product, 
  onEdit, 
  onDelete, 
  onViewTools 
}: ProductGridItemProps) {
  return (
    <div className="group">
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
              onClick={() => onEdit(product)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
              title="Modifier"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id, product.name || 'Sans nom')}
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
            onClick={() => onViewTools(product.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          >
            Analyser
          </button>
        </div>
      </div>
    </div>
  );
}