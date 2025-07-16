// lib/utils/workflowCascade.ts
import { StoredResult, ResultPayload } from './resultUtils';

export class WorkflowCascade {
  /**
   * Nettoie les résultats incohérents après modification d'un outil
   */
  static cleanupCascade(
    toolId: string,
    newResult: ResultPayload,
    currentResults: StoredResult[]
  ): StoredResult[] {
    // Si on modifie la qualification DM
    if (toolId === 'qualification_dm') {
      return this.handleDMQualificationChange(newResult, currentResults);
    }

    // Si on modifie le règlement
    if (toolId === 'regulation') {
      return this.handleRegulationChange(newResult, currentResults);
    }

    // Pour les autres outils, pas de cascade nécessaire
    return this.updateResult(toolId, newResult, currentResults);
  }

  /**
   * Gère le changement de qualification DM
   */
  private static handleDMQualificationChange(
    newResult: ResultPayload,
    currentResults: StoredResult[]
  ): StoredResult[] {
    // Toujours garder le nouveau résultat de qualification DM
    let updatedResults = this.updateResult('qualification_dm', newResult, currentResults);

    // Si le produit n'est plus un DM, supprimer TOUS les autres résultats
    if (newResult.resultKey === 'NOT_DM') {
      console.log('🧹 Nettoyage cascade : Produit non-DM détecté, suppression des autres outils');
      updatedResults = updatedResults.filter(r => r.tool === 'qualification_dm');
    }

    return updatedResults;
  }

  /**
   * Gère le changement de règlement
   */
  private static handleRegulationChange(
    newResult: ResultPayload,
    currentResults: StoredResult[]
  ): StoredResult[] {
    let updatedResults = this.updateResult('regulation', newResult, currentResults);

    // Si on passe d'un règlement à un autre, on pourrait vouloir nettoyer
    // la classification qui dépend du règlement
    // Pour l'instant, on garde tout car la classification peut être valide pour les deux

    return updatedResults;
  }

  /**
   * Met à jour un résultat spécifique
   */
  private static updateResult(
    toolId: string,
    newResult: ResultPayload,
    currentResults: StoredResult[]
  ): StoredResult[] {
    // Supprimer l'ancien résultat pour cet outil
    const filteredResults = currentResults.filter(r => r.tool !== toolId);
    
    // Ajouter le nouveau résultat
    return [...filteredResults, { tool: toolId, result: newResult }];
  }

  /**
   * Valide la cohérence d'un ensemble de résultats
   */
  static validateResultsConsistency(results: StoredResult[]): {
    isValid: boolean;
    issues: string[];
    suggestedCleanup: string[];
  } {
    const issues: string[] = [];
    const suggestedCleanup: string[] = [];

    const dmResult = results.find(r => r.tool === 'qualification_dm');
    const otherResults = results.filter(r => r.tool !== 'qualification_dm');

    // Vérifier la cohérence DM
    if (dmResult?.result.resultKey === 'NOT_DM' && otherResults.length > 0) {
      issues.push('Le produit n\'est pas qualifié comme DM mais d\'autres analyses sont présentes');
      suggestedCleanup.push('Supprimer les analyses réglementaires (règlement, classification, sécurité)');
    }

    // Vérifier la cohérence règlement/classification
    const regulationResult = results.find(r => r.tool === 'regulation');
    const classificationResult = results.find(r => r.tool === 'class_rule11');
    
    if (classificationResult && !regulationResult) {
      issues.push('Classification présente sans règlement défini');
      suggestedCleanup.push('Définir le règlement applicable avant la classification');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestedCleanup
    };
  }

  /**
   * Applique un nettoyage automatique selon les règles métier
   */
  static autoCleanup(results: StoredResult[]): {
    cleanedResults: StoredResult[];
    actions: string[];
  } {
    const actions: string[] = [];
    let cleanedResults = [...results];

    const dmResult = results.find(r => r.tool === 'qualification_dm');
    
    // Si NOT_DM, supprimer tout le reste
    if (dmResult?.result.resultKey === 'NOT_DM') {
      const otherResults = results.filter(r => r.tool !== 'qualification_dm');
      if (otherResults.length > 0) {
        cleanedResults = [dmResult];
        actions.push(`Supprimé ${otherResults.length} analyse(s) incompatible(s) avec un produit non-DM`);
      }
    }

    return { cleanedResults, actions };
  }
}