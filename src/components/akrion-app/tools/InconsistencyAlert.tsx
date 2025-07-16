// components/akrion-app/InconsistencyAlert.tsx
'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StoredResult } from '@/lib/utils/resultUtils';
import { WorkflowCascade } from '@/lib/utils/workflowCascade';
import { toast } from 'sonner';

interface InconsistencyAlertProps {
  results: StoredResult[];
  productId: string;
  onCleanup: () => void;
}

export function InconsistencyAlert({ 
  results, 
  productId, 
  onCleanup 
}: InconsistencyAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  // Réinitialiser la visibilité quand les résultats changent
  useEffect(() => {
    const validation = WorkflowCascade.validateResultsConsistency(results);
    if (!validation.isValid) {
      setIsVisible(true);
    }
  }, [results]);

  // Vérifier la cohérence
  const validation = WorkflowCascade.validateResultsConsistency(results);

  // Si tout est cohérent, pas de productId, ou si l'alerte est fermée, ne rien afficher
  if (validation.isValid || !isVisible || !productId) {
    return null;
  }

  const handleAutoCleanup = async () => {
    if (!productId || productId.trim() === '') {
      toast.error('ID du produit manquant');
      return;
    }

    setIsCleaningUp(true);
    
    try {
      const response = await fetch('/api/tools/cleanup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: productId.toString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.actions && data.actions.length > 0) {
          toast.success(`Nettoyage effectué : ${data.actions.join(', ')}`);
        } else {
          toast.info('Aucun nettoyage nécessaire');
        }
        
        onCleanup();
        setIsVisible(false);
      } else {
        let errorMessage = 'Erreur lors du nettoyage';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Fallback si impossible de parser l'erreur
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('Erreur lors du nettoyage automatique');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="bg-amber-50/80 backdrop-blur-sm rounded-lg p-4 border border-amber-200/60 mb-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-amber-800">
              Incohérence détectée dans les analyses
            </h4>
            <button
              onClick={handleDismiss}
              className="p-1 text-amber-500 hover:text-amber-700 rounded-lg transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Problèmes détectés */}
          <div className="space-y-2 mb-3">
            {validation.issues.map((issue, index) => (
              <p key={index} className="text-sm text-amber-700">
                • {issue}
              </p>
            ))}
          </div>

          {/* Actions suggérées */}
          {validation.suggestedCleanup.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium text-amber-800">Actions recommandées :</p>
              {validation.suggestedCleanup.map((action, index) => (
                <p key={index} className="text-sm text-amber-700 pl-4">
                  → {action}
                </p>
              ))}
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAutoCleanup}
              disabled={isCleaningUp}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCleaningUp ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Nettoyage...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Nettoyer automatiquement</span>
                </>
              )}
            </button>

            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-amber-700 hover:text-amber-900 text-sm font-medium transition-colors"
            >
              Ignorer pour l'instant
            </button>
          </div>

          <p className="text-xs text-amber-600 mt-2">
            💡 Le nettoyage automatique supprimera les analyses incompatibles avec le statut actuel du produit.
          </p>
        </div>
      </div>
    </div>
  );
}