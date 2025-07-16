'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/akrion-app/product';
import { 
  ArrowLeft, 
  Package, 
  CheckCircle2, 
  CheckCircle,
  Clock, 
  RefreshCw,
  ChevronDown,
  Settings,
  PlayCircle,
  ExternalLink,
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
  SheetOverlay,
} from '@/components/ui/sheet';
import WizardLite from '@/components/akrion-app/WizardLite';

import { mdConfig }             from '@/lib/akrion-toolbox/mdQualification/mdConfig';
import { regulatoryConfig }     from '@/lib/akrion-toolbox/regulatoryQualification/regulatoryConfig';
import { classificationConfig } from '@/lib/akrion-toolbox/classification/classificationConfig';
import { softwareSafetyConfig } from '@/lib/akrion-toolbox/softwareSafetyClass/softwareSafetyConfig';
import { toast } from 'sonner';

type StatusType = 'completed' | 'in-progress' | 'pending';
type ColorType = 'emerald' | 'blue' | 'amber' | 'gray';

interface StatusIconProps {
  status: StatusType;
  color: ColorType;
}

interface StoredResult {
  tool: string;
  result: { answers: Record<string, 'yes' | 'no'>; resultKey: string };
}

interface Props {
  products: Product[];
  initialResultsByProduct: Record<string, StoredResult[]>;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  color: ColorType;
  icon: React.ComponentType<{ className?: string }>;
}

// Configuration des outils avec leurs configs
const TOOLS = [
  { id: 'qualification_dm', label: 'Qualification DM',  icon: HeartPulse,  config: mdConfig          },
  { id: 'regulation',       label: 'Règlement',         icon: ScrollText,  config: regulatoryConfig  },
  { id: 'class_rule11',     label: 'Classe (règle 11)', icon: Layers3,     config: classificationConfig },
  { id: 'software_safety',  label: 'Sécurité logicielle', icon: ShieldCheck, config: softwareSafetyConfig },
] as const;

type ResultPayload = { answers: Record<string,'yes'|'no'>; resultKey: string };

const StatusIcon = ({ status, color }: StatusIconProps) => {
  const colorMap: Record<ColorType, string> = {
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    gray: 'text-gray-400 bg-gray-50'
  };

  if (status === 'completed') {
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap[color]}`}>
        <CheckCircle className="w-4 h-4" />
      </div>
    );
  }
  
  if (status === 'in-progress') {
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap.blue}`}>
        <PlayCircle className="w-4 h-4" />
      </div>
    );
  }
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap.gray}`}>
      <Clock className="w-4 h-4" />
    </div>
  );
};

export default function ProductToolsShell({ 
  products, 
  initialResultsByProduct 
}: Props) {
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

  // Interface améliorée pour aucun produit
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" data-full-height>
        {/* Header simplifié */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
          <div className="px-6 py-4">
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
          </div>
        </header>

        {/* Contenu principal centré */}
        <div className="flex items-center justify-center px-4 py-16">
          <div className="text-center space-y-8 max-w-2xl">
            {/* Illustration principale */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20">
                <Package className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">0</span>
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute -top-6 -left-6 w-6 h-6 bg-blue-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-8 w-4 h-4 bg-indigo-200 rounded-full opacity-40 animate-pulse delay-300"></div>
              <div className="absolute -bottom-8 -left-4 w-8 h-8 bg-purple-200 rounded-full opacity-30 animate-pulse delay-700"></div>
            </div>
            
            {/* Titre et description */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Commencez votre analyse
                <span className="block text-blue-600">réglementaire</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
                Créez votre premier produit pour accéder à nos outils d'analyse de conformité réglementaire automatisés.
              </p>
            </div>

            {/* Fonctionnalités */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <HeartPulse className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Qualification DM</h3>
                <p className="text-sm text-gray-600">
                  Déterminez si votre produit est un dispositif médical selon les réglementations en vigueur.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <ScrollText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Règlement applicable</h3>
                <p className="text-sm text-gray-600">
                  Identifiez les réglementations qui s'appliquent à votre produit médical.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Layers3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Classification</h3>
                <p className="text-sm text-gray-600">
                  Déterminez la classe de risque de votre dispositif médical selon la règle 11.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sécurité logicielle</h3>
                <p className="text-sm text-gray-600">
                  Évaluez la classe de sécurité logicielle de votre dispositif médical.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <button 
                onClick={() => router.push('/akrion-app/dashboard')}
                className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105"
              >
                <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Créer un produit</span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => router.push('/akrion-app/dashboard')}
                className="inline-flex items-center space-x-2 px-6 py-3 text-gray-700 hover:text-blue-600 font-medium transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Retour au Dashboard</span>
              </button>
            </div>

            {/* Aide supplémentaire */}
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200/60 max-w-lg mx-auto mt-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">?</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-blue-900 mb-2">Besoin d'aide ?</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Nos outils d'analyse réglementaire vous guident étape par étape dans la qualification de vos produits. 
                    Commencez par créer un produit dans le Dashboard pour débuter votre analyse.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
      setDropdownOpen(false);
    }
  };

  const handleLaunchTool = (toolId: string) => {
    setOpenSheet(toolId);
  };

  const handleEditTool = (toolId: string) => {
    setOpenSheet(toolId);
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
      
      //setOpenSheet(null);
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

  // Convertir les résultats en étapes de workflow
  const workflowSteps: WorkflowStep[] = TOOLS.map(tool => ({
    id: tool.id,
    title: tool.label,
    description: preview(current[tool.id]),
    status: current[tool.id] ? 'completed' : 'pending',
    color: 'emerald',
    icon: tool.icon
  }));

  return (
    <div className="min-h-screen" data-full-height>
      {/* Header unifié avec titre et sélecteur */}
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
                onClick={refreshData}
                disabled={isRefreshing}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-lg transition-colors"
                title="Actualiser"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
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
                            onClick={() => handleProductChange(product.id!)}
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

          {/* Carte de statut consolidée dans le header */}
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
              
              {/* Barre de progression dans le header */}
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
                <div key={step.id} className="group">
                  <div 
                    className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer"
                    onClick={() => step.status === 'completed' ? handleEditTool(step.id) : handleLaunchTool(step.id)}
                  >
                    <StatusIcon status={step.status} color={step.color} />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <step.icon className="w-4 h-4 text-gray-500" />
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-900 text-sm">
                              {step.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {step.status === 'completed' && (
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                              Terminé
                            </span>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              step.status === 'completed' ? handleEditTool(step.id) : handleLaunchTool(step.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title={step.status === 'completed' ? 'Modifier le résultat' : 'Lancer l\'outil'}
                          >
                            {step.status === 'completed' ? (
                              <Settings className="w-4 h-4" />
                            ) : (
                              <PlayCircle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
  inSheet={true} // ✅ Nouvelle prop pour enlever le fond bleu
/>
            </SheetContent>
          </Sheet>
        ) : null
      )}
    </div>
  );
}