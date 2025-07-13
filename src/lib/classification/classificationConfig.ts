import { questions, results } from '@/lib/classification/classificationWizard';
import type { QuestionID, ResultID, Question, Result } from '@/types/classificationWizard';
import { WizardConfig } from '@/types/wizardConfig';

export const classificationConfig: WizardConfig<QuestionID, ResultID, Question, Result> = {
  title   : 'Classification selon la règle 11',
  subtitle: 'Règlement (UE) 2017/745 • MDCG 2019-11',
  intro   : 'Cet outil vous aide à déterminer la classe de votre logiciel selon la règle 11 du règlement MDR. ⚠️ Ne couvre pas les autres règles.',
  total   : 5,
  questions,
  results,
  questionNumbers: {
    Q1: '1',
    Q2: '2',
    Q3: '3',
    Q4: '4',
    Q5: '5',
  },
};

