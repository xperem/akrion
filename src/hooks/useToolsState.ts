// hooks/useToolsState.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/akrion-app/product';
import { WorkflowLogic } from '@/lib/utils/workflowLogic';
import { WorkflowCascade } from '@/lib/utils/workflowCascade';
import { TOOLS } from '@/lib/constants/tools';
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
  
  // Fonction utilitaire pour valider l'ID du produit
  const getValidProductId = (urlId: string | null): string => {
    if (urlId && products.some(p => p.id === urlId)) {
      return urlId;
    }
    return products[0]?.id || '';
  };

  // États de base
  const [selectedProductId, setSelectedProductId] = useState<string>(
    getValidProductId(params.get('product'))
  );
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
  }, [initialResultsByProduct, selectedProductId]);

  // Synchronisation avec l'URL
  useEffect(() => {
    const currentUrlId = params.get('product');
    if (currentUrlId !== selectedProductId) {
      const newParams = new URLSearchParams(params);
      newParams.set('product', selectedProductId);
      router.replace(`?${newParams.toString()}`, { scroll: false });
    }
  }, [selectedProductId, params, router]);

  // Validation de l'ID du produit
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

  // Handler pour sauvegarder les résultats avec nettoyage en cascade
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
      
      // Mettre à jour les résultats localement avec nettoyage en cascade
      setCurrentResults(prev => {
        const existing = prev[selectedProductId] || [];
        
        // Ajouter ou mettre à jour le résultat
        const updatedResults = existing.filter(r => r.tool !== toolId);
        updatedResults.push({ tool: toolId, result: body });
        
        // Appliquer la logique de cascade
        const cleanedResults = WorkflowCascade.cleanupCascade(toolId, body, updatedResults);
        
        // Vérifier s'il y a eu des suppressions
        const deletedCount = updatedResults.length - cleanedResults.length;
        if (deletedCount > 0 && toolId === 'qualification_dm' && body.resultKey === 'NOT_DM') {
          toast.info(
            `Produit non-DM : ${deletedCount} analyse(s) supprimée(s) automatiquement`
          );
        }
        
        return { ...prev, [selectedProductId]: cleanedResults };
      });
      
      setLastRefresh(Date.now());
      
      // Forcer une actualisation légère après un court délai pour que l'alert se déclenche
      setTimeout(() => {
        setCurrentResults(prev => ({ ...prev }));
      }, 100);
      
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
      case 'MDR':       return 'Règlement MDR';
      case 'IVDR':      return 'Règlement IVDR';
      case 'CLASS_I':   return 'Classe I';
      case 'CLASS_IIA': return 'Classe IIa';
      case 'CLASS_IIB': return 'Classe IIb';
      case 'CLASS_III': return 'Classe III';
      case 'SAFETY_A':  return 'Sécurité classe A';
      case 'SAFETY_B':  return 'Sécurité classe B';
      case 'SAFETY_C':  return 'Sécurité classe C';
      default:          return r.resultKey;
    }
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const initialResults = currentResults[selectedProductId] || [];
  
  // Convertir les résultats en format utilisable
  const current = Object.fromEntries(
    initialResults.map((r) => [r.tool, r.result])
  ) as Record<string, ResultPayload>;

  // Utiliser la logique de workflow intelligente
  const { completedSteps, availableSteps, progressPercentage } = 
    WorkflowLogic.calculateSmartProgress(TOOLS, current);

  // Handler pour lancer un outil avec vérification
  const handleLaunchTool = (toolId: string) => {
    if (!WorkflowLogic.canLaunchTool(toolId, current)) {
      const message = WorkflowLogic.getBlockedMessage(toolId, current);
      toast.error(message);
      return;
    }
    setOpenSheet(toolId);
  };

  const handleEditTool = (toolId: string) => {
    if (!WorkflowLogic.canLaunchTool(toolId, current)) {
      const message = WorkflowLogic.getBlockedMessage(toolId, current);
      toast.error(message);
      return;
    }
    setOpenSheet(toolId);
  };

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
    availableSteps,
    progressPercentage,
    current,
    initialResults,
    
    // Actions
    setSelectedProductId,
    setDropdownOpen,
    setOpenSheet,
    handleProductChange,
    handleSave,
    handleLaunchTool,
    handleEditTool,
    refreshData,
    preview,
  };
}