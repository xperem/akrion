// lib/utils/workflowLogic.ts
import { StoredResult, ResultPayload } from './resultUtils';

export type StepStatus = 'pending' | 'available' | 'completed' | 'blocked';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  color: 'emerald' | 'blue' | 'amber' | 'gray' | 'red';
  icon: React.ComponentType<{ className?: string }>;
  blockReason?: string;
}

export class WorkflowLogic {
  /**
   * Détermine le statut d'une étape en fonction des résultats précédents
   */
  static getStepStatus(
    stepId: string,
    results: Record<string, ResultPayload>
  ): { status: StepStatus; blockReason?: string } {
    
    // Première étape : toujours disponible
    if (stepId === 'qualification_dm') {
      return results[stepId] 
        ? { status: 'completed' }
        : { status: 'available' };
    }

    // Vérifier si la qualification DM est terminée
    const dmResult = results['qualification_dm'];
    if (!dmResult) {
      return { 
        status: 'blocked', 
        blockReason: 'Complétez d\'abord la qualification DM' 
      };
    }

    // Si le produit n'est PAS un DM, bloquer tous les autres outils
    if (dmResult.resultKey === 'NOT_DM') {
      return { 
        status: 'blocked', 
        blockReason: 'Ce produit n\'est pas un dispositif médical' 
      };
    }

    // Si c'est un DM, les autres étapes sont disponibles
    switch (stepId) {
      case 'regulation':
        return results[stepId] 
          ? { status: 'completed' }
          : { status: 'available' };
          
      case 'class_rule11':
        // Peut nécessiter que le règlement soit défini
        const regulationResult = results['regulation'];
        if (!regulationResult) {
          return { 
            status: 'blocked', 
            blockReason: 'Déterminez d\'abord le règlement applicable' 
          };
        }
        return results[stepId] 
          ? { status: 'completed' }
          : { status: 'available' };
          
      case 'software_safety':
        // Disponible dès que c'est qualifié comme DM
        return results[stepId] 
          ? { status: 'completed' }
          : { status: 'available' };
          
      default:
        return { status: 'pending' };
    }
  }

  /**
   * Génère les étapes du workflow avec leur statut
   */
  static generateWorkflowSteps(
    tools: any[],
    results: Record<string, ResultPayload>,
    preview: (result?: ResultPayload) => string
  ): WorkflowStep[] {
    return tools.map(tool => {
      const { status, blockReason } = this.getStepStatus(tool.id, results);
      
      let color: WorkflowStep['color'] = 'gray';
      switch (status) {
        case 'completed':
          color = 'emerald';
          break;
        case 'available':
          color = 'blue';
          break;
        case 'blocked':
          color = 'red';
          break;
      }

      return {
        id: tool.id,
        title: tool.label,
        description: status === 'blocked' && blockReason 
          ? blockReason 
          : preview(results[tool.id]),
        status,
        color,
        icon: tool.icon,
        blockReason,
      };
    });
  }

  /**
   * Vérifie si un outil peut être lancé
   */
  static canLaunchTool(toolId: string, results: Record<string, ResultPayload>): boolean {
    const { status } = this.getStepStatus(toolId, results);
    return status === 'available' || status === 'completed';
  }

  /**
   * Obtient le message d'explication pour un outil bloqué
   */
  static getBlockedMessage(toolId: string, results: Record<string, ResultPayload>): string {
    const { blockReason } = this.getStepStatus(toolId, results);
    return blockReason || 'Cet outil n\'est pas disponible pour le moment.';
  }

  /**
   * Calcule le pourcentage de complétion en excluant les étapes bloquées
   */
  static calculateSmartProgress(
    tools: any[],
    results: Record<string, ResultPayload>
  ): { completedSteps: number; availableSteps: number; progressPercentage: number } {
    const steps = this.generateWorkflowSteps(tools, results, () => '');
    
    const availableSteps = steps.filter(step => 
      step.status === 'available' || step.status === 'completed'
    ).length;
    
    const completedSteps = steps.filter(step => 
      step.status === 'completed'
    ).length;
    
    const progressPercentage = availableSteps > 0 
      ? Math.round((completedSteps / availableSteps) * 100)
      : 0;

    return { completedSteps, availableSteps, progressPercentage };
  }
}