// hooks/useToolsState.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/akrion-app/product';
import { toast } from 'sonner';

interface StoredResult {
  tool: string;
  result: { answers: Record<string, 'yes' | 'no'>; resultKey: string };
}

type ResultPayload = { answers: Record<string,'yes'|'no'>; resultKey: string };

export function useToolsState(
  products: Product[],
  initialResultsByProduct: Record<string, StoredResult[]>
) {
  const params = useSearchParams();
  const router = useRouter();
  
  // États pour les résultats avec mise à jour automatique
  const [currentResults, setCurrentResults] = useState(initialResultsByProduct);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [openSheet, setOpenSheet] = useState<string | null>(null);

  // Fonction pour rafraîchir les données
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
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
      setDropdownOpen(false);
    }
  };

  // Handler pour sauvegarder les résultats
  const handleSave = async (
    toolId: string,
    answers: Record<string,'yes'|'no'>,
    resultKey: string
  ) => {
    const body = { answers, resultKey };

    const res = await fetch(`/api/tools/${toolId}?product=${selectedProductId}`, {
      method:  'POST',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      toast.success('Résultat enregistré');
      
      // Mettre à jour les résultats localement
      setCurrentResults(prev => {
        const existing = prev[selectedProductId] || [];
        const updated = [...existing.filter(r => r.tool !== toolId), { tool: toolId, result: body }];
        return { ...prev, [selectedProductId]: updated };
      });
      
      setLastRefresh(Date.now());
    } else {
      toast.error('Erreur serveur');
    }
  };

  // Helper pour afficher les résultats
  const preview = (r?: ResultPayload) => {
    if (!r) return 'En attente';
    switch (r.resultKey) {
      case 'DM':        return 'Dispositif médical';
      case 'NOT_DM':    return 'Pas un DM';
      default:          return r.resultKey;
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const initialResults = currentResults[selectedProductId] || [];
  const completedSteps = initialResults.length;
  const totalSteps = 4;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  // Convertir les résultats en format utilisable
  const current = Object.fromEntries(
    initialResults.map((r) => [r.tool, r.result])
  ) as Record<string, ResultPayload>;

  return {
    // État
    selectedProductId,
    selectedProduct,
    currentResults,
    isRefreshing,
    dropdownOpen,
    lastRefresh,
    openSheet,
    completedSteps,
    totalSteps,
    progressPercentage,
    current,
    initialResults,
    
    // Actions
    setSelectedProductId,
    setDropdownOpen,
    setOpenSheet,
    handleProductChange,
    handleSave,
    refreshData,
    preview,
  };
}