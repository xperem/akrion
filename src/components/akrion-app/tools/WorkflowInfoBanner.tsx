// components/akrion-app/WorkflowInfoBanner.tsx
'use client';

import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { ResultPayload } from '@/lib/utils/resultUtils';

interface WorkflowInfoBannerProps {
  dmResult?: ResultPayload;
  completedSteps: number;
  availableSteps: number;
}

export function WorkflowInfoBanner({ 
  dmResult, 
  completedSteps, 
  availableSteps 
}: WorkflowInfoBannerProps) {
  // Si pas encore de qualification DM
  if (!dmResult) {
    return (
      <div className="bg-blue-50/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/60 mb-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">
              Commencez par la qualification
            </p>
            <p className="text-blue-700">
              Déterminez d'abord si votre produit est un dispositif médical. 
              Cette étape débloquera l'accès aux autres outils d'analyse.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si le produit n'est PAS un DM
  if (dmResult.resultKey === 'NOT_DM') {
    return (
      <div className="bg-amber-50/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200/60 mb-4">
        <div className="flex items-start space-x-3">
          <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-1">
              Produit non qualifié comme dispositif médical
            </p>
            <p className="text-amber-700">
              Votre produit n'étant pas un dispositif médical selon l'analyse, 
              les autres outils réglementaires ne sont pas applicables. 
              Vous pouvez exporter cette conclusion ou modifier la qualification si nécessaire.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si c'est un DM et tout va bien
  if (dmResult.resultKey === 'DM') {
    return (
      <div className="bg-green-50/60 backdrop-blur-sm rounded-lg p-4 border border-green-200/60 mb-4">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800 mb-1">
              Dispositif médical confirmé
            </p>
            <p className="text-green-700">
              Votre produit est qualifié comme dispositif médical. 
              Continuez avec les autres outils pour déterminer le règlement applicable, 
              la classification et les exigences de sécurité logicielle.
              {completedSteps < availableSteps && (
                <span className="font-medium">
                  {' '}({availableSteps - completedSteps} étapes restantes)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}