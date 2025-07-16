// src/app/akrion-app/(protected)/tools/ProductToolsShell.tsx
'use client';

import { Product } from '@/types/akrion-app/product';
import { 
  HeartPulse,
  ScrollText,
  Layers3,
  ShieldCheck,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import WizardLite from '@/components/akrion-app/tools/WizardLite';
import { ToolsHeader } from '@/components/akrion-app/tools/ToolsHeader';
import { WorkflowStep } from '@/components/akrion-app/tools/WorkFlowStep';
import { ToolsEmptyState } from '@/components/akrion-app/tools/ToolsEmptyState';
import { WorkflowInfoBanner } from '@/components/akrion-app/tools/WorkflowInfoBanner';
import { ExportButton } from '@/components/akrion-app/tools/ExportButton';
import { InconsistencyAlert } from '@/components/akrion-app/tools/InconsistencyAlert'; // Add this import
import { TOOLS } from '@/lib/constants/tools';
import { WorkflowLogic } from '@/lib/utils/workflowLogic';
import { useToolsState } from '@/hooks/useToolsState';

import { mdConfig }             from '@/lib/akrion-toolbox/mdQualification/mdConfig';
import { regulatoryConfig }     from '@/lib/akrion-toolbox/regulatoryQualification/regulatoryConfig';
import { classificationConfig } from '@/lib/akrion-toolbox/classification/classificationConfig';
import { softwareSafetyConfig } from '@/lib/akrion-toolbox/softwareSafetyClass/softwareSafetyConfig';

interface StoredResult {
  tool: string;
  result: { answers: Record<string, 'yes' | 'no'>; resultKey: string };
}

interface Props {
  products: Product[];
  initialResultsByProduct: Record<string, StoredResult[]>;
}

// Définir les types pour les étapes de workflow
type StatusType = 'completed' | 'in-progress' | 'pending' | 'available' | 'blocked';
type ColorType = 'emerald' | 'blue' | 'amber' | 'gray' | 'red';

interface WorkflowStepType {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  color: ColorType;
  icon: React.ComponentType<{ className?: string }>;
  blockReason?: string;
  [key: string]: any;
}

export default function ProductToolsShell({ 
  products, 
  initialResultsByProduct 
}: Props) {
  const {
    selectedProductId,
    selectedProduct,
    isRefreshing,
    dropdownOpen,
    openSheet,
    completedSteps,
    availableSteps,
    progressPercentage,
    current,
    initialResults,
    setDropdownOpen,
    setOpenSheet,
    handleProductChange,
    handleSave,
    handleLaunchTool,
    handleEditTool,
    refreshData,
    preview,
  } = useToolsState(products, initialResultsByProduct);

  // Interface améliorée pour aucun produit
  if (products.length === 0) {
    return <ToolsEmptyState />;
  }

  // Convertir les résultats en étapes de workflow avec logique intelligente
  const workflowSteps = WorkflowLogic.generateWorkflowSteps(TOOLS, current, preview);

  return (
    <div className="min-h-screen" data-full-height>
      <ToolsHeader
        selectedProduct={selectedProduct}
        products={products}
        isRefreshing={isRefreshing}
        dropdownOpen={dropdownOpen}
        completedSteps={completedSteps}
        totalSteps={availableSteps}
        progressPercentage={progressPercentage}
        onRefresh={refreshData}
        onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
        onProductChange={handleProductChange}
      />

      {/* Contenu principal */}
      <main className="px-6 py-6">
        {/* Alerte d'incohérence - seulement si on a un productId */}
        {selectedProductId && (
          <InconsistencyAlert 
            results={initialResults}
            productId={selectedProductId}
            onCleanup={refreshData}
          />
        )}

        {/* Banner informatif selon le statut */}
        <WorkflowInfoBanner 
          dmResult={current['qualification_dm']}
          completedSteps={completedSteps}
          availableSteps={availableSteps}
        />

        {/* Workflow modernisé */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm">
          <div className="p-4 border-b border-gray-100/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Workflow d'analyse
                </h3>
                <p className="text-sm text-gray-500">
                  Suivez les étapes pour analyser votre produit
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span>{isRefreshing ? 'Actualisation...' : 'Données à jour'}</span>
                </div>
                {selectedProduct && selectedProduct.id && initialResults.length > 0 && (
                  <ExportButton 
                    product={selectedProduct as Product & { id: string }}
                    results={initialResults}
                    variant="outline"
                    size="sm"
                  />
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {workflowSteps.map((step: WorkflowStepType) => (
                <WorkflowStep
                  key={step.id}
                  {...step}
                  onLaunch={handleLaunchTool}
                  onEdit={handleEditTool}
                />
              ))}
            </div>
            
            {/* Message d'aide */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">
                    Comment utiliser les outils
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Cliquez sur une étape pour lancer l'outil correspondant dans le panneau latéral. 
                    Les résultats seront automatiquement sauvegardés. 
                    {current['qualification_dm']?.resultKey === 'NOT_DM' && (
                      <span className="font-medium text-amber-700">
                        {' '}Les autres outils sont bloqués car le produit n'est pas un dispositif médical.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sheets pour les outils */}
      {TOOLS.map(({ id, label, config }) =>
        openSheet === id ? (
          <Sheet key={id} open onOpenChange={() => setOpenSheet(null)}>
            <SheetContent
              side="right"
              className="
                w-full 
                max-w-[640px]      
                lg:max-w-[720px]   
                overflow-y-auto 
                rounded-l-2xl
                bg-white/90 
                backdrop-blur-lg 
                px-8 py-10 
                shadow-xl
              "
            >
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-semibold">
                  {label}
                </SheetTitle>
              </SheetHeader>

              <WizardLite
                config={config}
                initial={current[id]}
                onFinish={(answers, rk) => handleSave(id, answers, rk)}
                inSheet={true}
              />
            </SheetContent>
          </Sheet>
        ) : null
      )}
    </div>
  );
}