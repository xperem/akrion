// lib/constants/tools.ts
import { HeartPulse, ScrollText, Layers3, ShieldCheck } from 'lucide-react';
import { mdConfig } from '@/lib/akrion-toolbox/mdQualification/mdConfig';
import { regulatoryConfig } from '@/lib/akrion-toolbox/regulatoryQualification/regulatoryConfig';
import { classificationConfig } from '@/lib/akrion-toolbox/classification/classificationConfig';
import { softwareSafetyConfig } from '@/lib/akrion-toolbox/softwareSafetyClass/softwareSafetyConfig';

export interface ToolConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  config: any; // Remplacer par le type exact de vos configs
  description: string;
}

export const TOOLS: ToolConfig[] = [
  { 
    id: 'qualification_dm', 
    label: 'Qualification DM',  
    icon: HeartPulse,  
    config: mdConfig,
    description: 'Déterminez si votre produit est un dispositif médical'
  },
  { 
    id: 'regulation',       
    label: 'Règlement',         
    icon: ScrollText,  
    config: regulatoryConfig,
    description: 'Identifiez les réglementations applicables'
  },
  { 
    id: 'class_rule11',     
    label: 'Classe (règle 11)', 
    icon: Layers3,     
    config: classificationConfig,
    description: 'Déterminez la classe de risque selon la règle 11'
  },
  { 
    id: 'software_safety',  
    label: 'Sécurité logicielle', 
    icon: ShieldCheck, 
    config: softwareSafetyConfig,
    description: 'Évaluez la classe de sécurité logicielle'
  },
];

export const TOTAL_STEPS = TOOLS.length;