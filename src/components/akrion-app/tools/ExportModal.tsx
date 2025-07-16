// components/akrion-app/ExportModal.tsx
'use client';

import { useState } from 'react';
import { 
  Download, 
  FileText, 
  File, 
  X, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExportService, ExportData } from '@/lib/services/exportService';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportData: ExportData;
}

type ExportFormat = 'pdf' | 'docx';
type ExportStatus = 'idle' | 'loading' | 'success' | 'error';

export function ExportModal({ isOpen, onClose, exportData }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');

  const handleExport = async () => {
    setExportStatus('loading');
    
    try {
      if (selectedFormat === 'pdf') {
        await ExportService.exportToPDF(exportData);
      } else {
        await ExportService.exportToDocx(exportData);
      }
      
      setExportStatus('success');
      toast.success(`Fiche produit exportée en ${selectedFormat.toUpperCase()}`);
      
      // Fermer le modal après un délai
      setTimeout(() => {
        onClose();
        setExportStatus('idle');
      }, 1500);
      
    } catch (error) {
      setExportStatus('error');
      toast.error('Erreur lors de l\'export');
      console.error('Export error:', error);
    }
  };

  const formatOptions = [
    {
      id: 'pdf' as ExportFormat,
      name: 'PDF',
      description: 'Format portable, idéal pour la consultation',
      icon: FileText,
      color: 'text-red-600 bg-red-50',
      recommended: true,
    },
    {
      id: 'docx' as ExportFormat,
      name: 'Word (DOCX)',
      description: 'Format éditable, idéal pour la modification',
      icon: File,
      color: 'text-blue-600 bg-blue-50',
      recommended: false,
    },
  ];

  const getStatusIcon = () => {
    switch (exportStatus) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Download className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (exportStatus) {
      case 'loading':
        return 'Génération en cours...';
      case 'success':
        return 'Export réussi !';
      case 'error':
        return 'Erreur lors de l\'export';
      default:
        return 'Exporter la fiche';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Exporter la fiche produit
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aperçu des données */}
          <div className="bg-blue-50/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200/60">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {exportData.product.name || 'Produit sans nom'}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Progression de l'analyse</span>
                    <span className="font-medium text-blue-600">
                      {exportData.completionRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Outils complétés</span>
                    <span className="font-medium">
                      {exportData.results.length}/4
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Date d'export</span>
                    <span className="font-medium">
                      {exportData.exportDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sélection du format */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Choisir le format d'export</h4>
            <div className="space-y-3">
              {formatOptions.map((format) => (
                <div
                  key={format.id}
                  className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${format.color}`}>
                      <format.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-gray-900">{format.name}</h5>
                        {format.recommended && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            Recommandé
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {format.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedFormat === format.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedFormat === format.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Avertissement si données incomplètes */}
          {exportData.completionRate < 100 && (
            <div className="bg-amber-50/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200/60">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">
                    Analyse incomplète
                  </p>
                  <p className="text-amber-700">
                    Certains outils n'ont pas encore été complétés. 
                    La fiche exportée contiendra uniquement les données disponibles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={exportStatus === 'loading'}
              className="px-4 py-2"
            >
              Annuler
            </Button>
            <Button
              onClick={handleExport}
              disabled={exportStatus === 'loading'}
              className={`px-6 py-2 flex items-center space-x-2 ${
                exportStatus === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : exportStatus === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}