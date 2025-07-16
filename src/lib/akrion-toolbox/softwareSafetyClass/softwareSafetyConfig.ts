import { WizardConfig } from '@/types/akrion-toolbox/wizardConfig';
import {
  questions,
  results,
  getQuestionNumber,
} from '@/lib/akrion-toolbox/softwareSafetyClass/softwareSafetyWizard';
import type {
  QuestionID, ResultID, Question, Result,
} from '@/types/akrion-toolbox/softwareSafetyWizard';

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
