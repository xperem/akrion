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

// Configuration des outils avec leurs configs
const TOOLS = [
  { id: 'qualification_dm', label: 'Qualification DM',  icon: HeartPulse,  config: mdConfig          },
  { id: 'regulation',       label: 'Règlement',         icon: ScrollText,  config: regulatoryConfig  },
  { id: 'class_rule11',     label: 'Classe (règle 11)', icon: Layers3,     config: classificationConfig },
  { id: 'software_safety',  label: 'Sécurité logicielle', icon: ShieldCheck, config: softwareSafetyConfig },
] as const;

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
    totalSteps,
    progressPercentage,
    current,
    setDropdownOpen,
    setOpenSheet,
    handleProductChange,
    handleSave,
    refreshData,
    preview,
  } = useToolsState(products, initialResultsByProduct);

  // Interface améliorée pour aucun produit
  if (products.length === 0) {
    return <ToolsEmptyState />;
  }

  const handleLaunchTool = (toolId: string) => {
    setOpenSheet(toolId);
  };

  const handleEditTool = (toolId: string) => {
    setOpenSheet(toolId);
  };

  // Convertir les résultats en étapes de workflow
  const workflowSteps = TOOLS.map(tool => ({
    id: tool.id,
    title: tool.label,
    description: preview(current[tool.id]),
    status: current[tool.id] ? 'completed' as const : 'pending' as const,
    color: 'emerald' as const,
    icon: tool.icon
  }));

  return (
    <div className="min-h-screen" data-full-height>
      <ToolsHeader
        selectedProduct={selectedProduct}
        products={products}
        isRefreshing={isRefreshing}
        dropdownOpen={dropdownOpen}
        completedSteps={completedSteps}
        totalSteps={totalSteps}
        progressPercentage={progressPercentage}
        onRefresh={refreshData}
        onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
        onProductChange={handleProductChange}
      />

      {/* Contenu principal */}
      <main className="px-6 py-6">
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
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span>{isRefreshing ? 'Actualisation...' : 'Données à jour'}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-3">
              {workflowSteps.map((step) => (
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
                    Cliquez sur une étape pour lancer l'outil correspondant dans le panneau latéral. Les résultats seront automatiquement sauvegardés.
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