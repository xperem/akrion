// src/types/akrion-app/product.ts
export type ToolHistory = {
  answers: Record<string, 'yes' | 'no'>;
  resultKey: string;
  timestamp: string;
};

export type Product = {
  id?: string;
  name?: string | null;
  created_at?: string;
  description?: string | null;
  intended_use?: string | null;
  intended_user?: string | null;
  intended_environment?: string | null;
  patient_population?: string | null;
  operation_principle?: string | null;
  
  // Colonnes de résultats (rétrocompatibilité)
  is_dm?: boolean | null;
  regulation?: string | null;
  mdr_class?: string | null;
  software_safety?: string | null;
  
  // Nouvelle colonne pour l'historique complet
  tool_histories?: Record<string, ToolHistory> | null;
};