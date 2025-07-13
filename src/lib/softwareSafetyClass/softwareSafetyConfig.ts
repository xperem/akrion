import { WizardConfig } from '@/types/wizardConfig';
import {
  questions,
  results,
  getQuestionNumber,
} from '@/lib/softwareSafetyClass/softwareSafetyWizard';
import type {
  QuestionID, ResultID, Question, Result,
} from '@/types/softwareSafetyWizard';

export const softwareSafetyConfig: WizardConfig<
  QuestionID,
  ResultID,
  Question,
  Result
> = {
  title   : 'Classification de sécurité logicielle',
  subtitle: 'IEC 62304 • Figure 3',
  intro   : 'Répondez aux questions pour attribuer la classe de sécurité (A, B ou C) de votre logiciel.',
  total   : 3,
  questions,
  results,
  questionNumbers: {
    Q1: '1',
    Q2: '2',
    Q3: '3',
  },
};
