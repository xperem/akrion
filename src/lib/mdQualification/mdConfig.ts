// lib/mdConfig.ts
import { questions, results } from '@/lib/mdQualification/mdQualification';
import type {
  Question,
  Result,
  QuestionID,
  ResultID,
} from '@/types/mdQualification';
import { WizardConfig } from '@/types/wizardConfig';

/* --------------------------------------------------------------
 * Génère automatiquement le mapping Q → numéro lisible
 * (ex. Q1 → "1", Q2B → "2B").  Tu peux l’écrire à la main
 * si tu préfères un format particulier.
 * ------------------------------------------------------------ */
const questionNumbers = Object.fromEntries(
  (Object.keys(questions) as QuestionID[]).map((q) => [
    q,
    q.replace(/^Q/i, ''), // garde tout ce qui suit "Q"
  ])
) as Record<QuestionID, string>;

export const mdConfig: WizardConfig<
  QuestionID,
  ResultID,
  Question,
  Result
> = {
  title: 'Arbre de qualification',
  subtitle: 'MDCG 2019-11 (v2.1) • Logiciels',
  intro:
    'Déterminez si votre produit est un logiciel dispositif médical',
  total: 5,
  questions,
  results,
  questionNumbers,
};
