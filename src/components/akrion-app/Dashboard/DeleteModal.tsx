import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isLoading?: boolean;
}

export function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName, 
  isLoading = false 
}: DeleteModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [step, setStep] = useState<'warning' | 'confirmation'>('warning');

  const handleNextStep = () => {
    setStep('confirmation');
  };

  const handleConfirm = () => {
    if (confirmationText === 'SUPPRIMER') {
      onConfirm();
    }
  };

  const handleClose = () => {
    setStep('warning');
    setConfirmationText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Suppression du produit
              </h3>
              <p className="text-sm text-gray-500">
                Cette action est irréversible
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'warning' ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">
                  Vous êtes sur le point de supprimer :
                </h4>
                <p className="text-red-800 font-semibold">
                  "{productName}"
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">
                  Cette action supprimera définitivement :
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Toutes les données du produit</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Les analyses réglementaires associées</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>L'historique des résultats</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Attention :</strong> Cette action ne peut pas être annulée. 
                  Assurez-vous d'avoir sauvegardé toutes les données importantes.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Confirmation de suppression
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Pour confirmer la suppression de <strong>"{productName}"</strong>, 
                  tapez exactement <strong>SUPPRIMER</strong> ci-dessous :
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="Tapez SUPPRIMER"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center font-mono"
                  disabled={isLoading}
                  autoFocus
                />
                
                {confirmationText && confirmationText !== 'SUPPRIMER' && (
                  <p className="text-sm text-red-600 text-center">
                    Le texte doit correspondre exactement à "SUPPRIMER"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            Annuler
          </button>
          
          {step === 'warning' ? (
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              disabled={isLoading}
            >
              Continuer
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={confirmationText !== 'SUPPRIMER' || isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Suppression...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer définitivement</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}