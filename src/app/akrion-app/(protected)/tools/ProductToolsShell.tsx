'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/akrion-app/product';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import ToolTimeline from '@/components/akrion-app/ToolTimeline';
import { ArrowLeft, Package, CheckCircle2, Clock, TrendingUp, RefreshCw } from 'lucide-react';

interface StoredResult {
  tool: string;
  result: { answers: Record<string, 'yes' | 'no'>; resultKey: string };
}

interface Props {
  products: Product[];
  initialResultsByProduct: Record<string, StoredResult[]>;
}

export default function ProductToolsShell({ 
  products, 
  initialResultsByProduct 
}: Props) {
  const params = useSearchParams();
  const router = useRouter();
  
  // État pour les résultats avec mise à jour automatique
  const [currentResults, setCurrentResults] = useState(initialResultsByProduct);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Fonction pour rafraîchir les données
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ici vous devriez appeler votre API pour récupérer les données mises à jour
      // const updatedResults = await fetchUpdatedResults();
      // setCurrentResults(updatedResults);
      
      // Pour l'instant, on force juste une re-render
      router.refresh();
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [router]);

  // Auto-refresh toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Mise à jour des résultats quand les props changent
  useEffect(() => {
    setCurrentResults(initialResultsByProduct);
  }, [initialResultsByProduct]);

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">0</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-slate-900">
              Aucun produit disponible
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Créez votre premier produit dans le Dashboard pour commencer à utiliser nos outils réglementaires.
            </p>
          </div>
          
          <button 
            onClick={() => router.push('/akrion-app/dashboard')}
            className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Aller au Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  const getValidProductId = (urlId: string | null): string => {
    if (urlId && products.some(p => p.id === urlId)) {
      return urlId;
    }
    return products[0]?.id || '';
  };

  const [selectedProductId, setSelectedProductId] = useState<string>(
    getValidProductId(params.get('product'))
  );

  useEffect(() => {
    const currentUrlId = params.get('product');
    if (currentUrlId !== selectedProductId) {
      const newParams = new URLSearchParams(params);
      newParams.set('product', selectedProductId);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [selectedProductId, params, router]);

  useEffect(() => {
    const validId = getValidProductId(selectedProductId);
    if (validId !== selectedProductId) {
      setSelectedProductId(validId);
    }
  }, [products, selectedProductId]);

  const handleProductChange = (newProductId: string) => {
    if (products.some(p => p.id === newProductId)) {
      setSelectedProductId(newProductId);
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const initialResults = currentResults[selectedProductId] || [];
  const progressPercentage = Math.round((initialResults.length / 4) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header moderne et épuré */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/60">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo et titre - plus compact */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Outils Réglementaires
                </h1>
                <p className="text-xs text-slate-500">
                  Analyse intelligente de conformité
                </p>
              </div>
            </div>

            {/* Bouton de rafraîchissement et sélecteur */}
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  isRefreshing 
                    ? 'bg-slate-100 border-slate-200 cursor-not-allowed' 
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
                title="Actualiser les données"
              >
                <RefreshCw className={`w-4 h-4 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <span className="text-sm font-medium text-slate-600 hidden sm:block">
                Produit :
              </span>
              <Select value={selectedProductId} onValueChange={handleProductChange}>
                <SelectTrigger className="w-[240px] bg-white/80 border-slate-200 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md">
                  <SelectValue placeholder="Choisir un produit" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-slate-200">
                  {products
                    .filter(product => product.id)
                    .map((product) => (
                      <SelectItem key={product.id} value={product.id!} className="hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
                          <span className="font-medium text-slate-900">{product.name || 'Sans nom'}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Carte produit - redesignée */}
        {selectedProduct && (
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Analyse réglementaire en cours
                  </p>
                </div>
              </div>

              {/* Stats modernisées */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 rounded-lg mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">{initialResults.length}</div>
                  <div className="text-xs text-slate-500">Terminés</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">{4 - initialResults.length}</div>
                  <div className="text-xs text-slate-500">Restants</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-lg mb-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">{progressPercentage}%</div>
                  <div className="text-xs text-slate-500">Progression</div>
                </div>
              </div>
            </div>

            {/* Barre de progression épurée */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Avancement</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">{progressPercentage}%</span>
                 
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Workflow section - plus moderne */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-200/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Workflow d'analyse réglementaire
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  Suivez les étapes pour analyser votre produit
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <span>{isRefreshing ? 'Actualisation...' : 'Données à jour'}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <ToolTimeline
  key={selectedProductId}
  productId={selectedProductId}
  initialResults={initialResults}
  onResultSaved={(tool, result) => {
    setCurrentResults(prev => {
      const existing = prev[selectedProductId] || [];
      const updated = [...existing.filter(r => r.tool !== tool), { tool, result }];
      return { ...prev, [selectedProductId]: updated };
    });
    setLastRefresh(Date.now());
  }}
/>
          </div>
        </div>
      </div>
    </div>
  );
}