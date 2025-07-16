// components/akrion-app/ToolsEmptyState.tsx
'use client';

import { useRouter } from 'next/navigation';
import { 
  Package, 
  ArrowLeft, 
  HeartPulse, 
  ScrollText, 
  Layers3, 
  ShieldCheck 
} from 'lucide-react';

export function ToolsEmptyState() {
  const router = useRouter();

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