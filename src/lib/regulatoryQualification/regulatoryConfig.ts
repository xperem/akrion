// lib/regulatoryConfig.ts
import { questions, results } from '@/lib/regulatoryQualification/regulatoryQualification';
import type {
  Question,
  Result,
  QuestionID,
  ResultID,
} from '@/types/regulatoryQualification';
import { WizardConfig } from '@/types/wizardConfig';

/* Génère un mapping Q1 → "1", Q2 → "2", etc. */
const questionNumbers = Object.fromEntries(
  (Object.keys(questions) as QuestionID[]).map((q) => [
    q,
    q.replace(/^Q/i, ''),
  ])
) as Record<QuestionID, string>;

export const regulatoryConfig: WizardConfig<
  QuestionID,
  ResultID,
  Question,
  Result
> = {
  title: 'Qualification réglementaire',
  subtitle: 'MDCG 2019-11 • Figure 2',
  intro: 'Déterminez si votre logiciel relève du règlement MDR ou IVDR.',
  total: 3,
  questions,
  results,
  questionNumbers,
};
