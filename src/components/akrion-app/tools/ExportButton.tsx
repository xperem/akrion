// components/akrion-app/ExportButton.tsx
'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { ExportService } from '@/lib/services/exportService';
import { Product } from '@/types/akrion-app/product';
import { StoredResult } from '@/lib/utils/resultUtils';

// Type pour s'assurer que le produit a un ID
type ProductWithId = Product & { id: string };

interface ExportButtonProps {
  product: ProductWithId;
  results: StoredResult[];
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ExportButton({ 
  product, 
  results, 
  variant = 'outline',
  size = 'md',
  className = '' 
}: ExportButtonProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const exportData = ExportService.prepareExportData(product, results);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200';
      case 'outline':
      default:
        return 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'md':
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-5 h-5';
      case 'md':
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsExportModalOpen(true)}
        className={`
          inline-flex items-center space-x-2 
          border rounded-lg font-medium
          transition-all duration-200
          hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className}
        `}
        title="Exporter la fiche produit"
      >
        <Download className={getIconSize()} />
        <span>Exporter</span>
      </button>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        exportData={exportData}
      />
    </>
  );
}