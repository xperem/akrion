// lib/utils/resultUtils.ts

export type ResultPayload = { 
  answers: Record<string,'yes'|'no'>; 
  resultKey: string 
};

export interface StoredResult {
  tool: string;
  result: ResultPayload;
}

export function getResultPreview(result?: ResultPayload): string {
  if (!result) return 'En attente';
  
  switch (result.resultKey) {
    case 'DM':        return 'Dispositif médical';
    case 'NOT_DM':    return 'Pas un DM';
    case 'MDR':       return 'Règlement MDR';
    case 'IVDR':      return 'Règlement IVDR';
    case 'CLASS_I':   return 'Classe I';
    case 'CLASS_IIA': return 'Classe IIa';
    case 'CLASS_IIB': return 'Classe IIb';
    case 'CLASS_III': return 'Classe III';
    case 'SAFETY_A':  return 'Sécurité classe A';
    case 'SAFETY_B':  return 'Sécurité classe B';
    case 'SAFETY_C':  return 'Sécurité classe C';
    default:          return result.resultKey;
  }
}

export function calculateProgress(results: StoredResult[], totalSteps: number): {
  completedSteps: number;
  progressPercentage: number;
} {
  const completedSteps = results.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  return { completedSteps, progressPercentage };
}

export function convertResultsToMap(results: StoredResult[]): Record<string, ResultPayload> {
  return Object.fromEntries(
    results.map((r) => [r.tool, r.result])
  );
}