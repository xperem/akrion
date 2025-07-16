// components/akrion-app/ToolsHeader.tsx
'use client';

import { Package, RefreshCw, ChevronDown } from 'lucide-react';
import { Product } from '@/types/akrion-app/product';

interface ToolsHeaderProps {
  selectedProduct: Product | undefined;
  products: Product[];
  isRefreshing: boolean;
  dropdownOpen: boolean;
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  onRefresh: () => void;
  onToggleDropdown: () => void;
  onProductChange: (productId: string) => void;
}

export function ToolsHeader({
  selectedProduct,
  products,
  isRefreshing,
  dropdownOpen,
  completedSteps,
  totalSteps,
  progressPercentage,
  onRefresh,
  onToggleDropdown,
  onProductChange,
}: ToolsHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Outils Réglementaires
              </h1>
              <p className="text-gray-600 text-sm">
                Analyse intelligente de conformité réglementaire
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="relative">
              <button
                onClick={onToggleDropdown}
                className="flex items-center space-x-2 px-3 py-2 bg-white/60 border border-gray-200/60 rounded-lg hover:bg-white/80 hover:border-gray-300 transition-colors backdrop-blur-sm text-sm"
              >
                <Package className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">{selectedProduct?.name || 'Sans nom'}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-lg shadow-lg z-20">
                  <div className="p-2">
                    {products
                      .filter(product => product.id)
                      .map((product) => (
                        <button
                          key={product.id}
                          onClick={() => onProductChange(product.id!)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50/60 rounded-md transition-colors"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          <span className="text-gray-900">{product.name || 'Sans nom'}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carte de statut consolidée */}
        {selectedProduct && (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-blue-200/60 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center shadow-sm">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Analyse réglementaire
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{completedSteps}</div>
                  <div className="text-xs text-gray-600">Terminés</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{totalSteps - completedSteps}</div>
                  <div className="text-xs text-gray-600">Restants</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{progressPercentage}%</div>
                  <div className="text-xs text-gray-600">Progression</div>
                </div>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Avancement</span>
                <span className="text-sm text-gray-600">{completedSteps} / {totalSteps}</span>
              </div>
              <div className="w-full bg-white/40 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}