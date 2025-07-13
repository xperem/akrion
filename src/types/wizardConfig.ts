// src/types/WizardConfig.ts

/**
 * Configuration générique pour un arbre de décision "Wizard".
 *
 * Q  = type des identifiants de question (ex : "Q1", "Q2"…)
 * R  = type des identifiants de résultat (ex : "DM", "NOT_DM"…)
 * QT = type d’une question individuelle (doit contenir `text`, `yes`, `no`, etc.)
 * RT = type d’un résultat individuel (doit contenir `verdict`, `message`, `color`)
 */
export type WizardConfig<
  Q extends string,
  R extends string,
  QT,
  RT
> = {
  title: string;                          // Titre affiché en haut de l’UI
  subtitle: string;                      // Sous-titre ou référence réglementaire
  intro: string;                         // Phrase introductive
  total: number;                         // Nombre total de questions

  questions: Record<Q, QT>;              // Ensemble des questions (arbre logique)
  results: Record<R, RT>;                // Résultats possibles (DM, MDR, etc.)
  questionNumbers: Record<Q, string>;    // Mapping Q → numéro affiché (ex : "1", "2B", etc.)
};
