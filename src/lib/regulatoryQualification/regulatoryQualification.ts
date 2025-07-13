import { QuestionID, Question, ResultID, Result } from '@/types/regulatoryQualification';

/* Questions issues de la figure 2 MDCG 2019-11 */
export const questions: Record<QuestionID, Question> = {
  Q1: {
    text: 'Le logiciel fournit-il des informations relevant de la <strong>définition IVD</strong> ?',
    hint: 'IVD : dispositif destiné à l’examen in vitro d’échantillons biologiques (art. 2 IVDR).',
    yes : 'Q2',
    no  : 'MDR',
  },
  Q2: {
    text: 'Ces informations reposent-elles <strong>uniquement</strong> sur des données issues de dispositifs médicaux in vitro ?',
    yes : 'Q3',
    no  : 'MDR',
  },
  Q3: {
    text: 'La finalité est-elle principalement pilotée par des <strong>données IVD</strong> ?',
    yes : 'IVDR',
    no  : 'MDR',
  },
};

/* Verdicts */
export const results: Record<ResultID, Result> = {
  MDR: {
    verdict : 'Logiciel MD (MDR)',
    message : '✅ Couvert par le règlement (UE) 2017/745.',
    color   : 'bg-indigo-50 border-indigo-200 text-indigo-800',
  },
  IVDR: {
    verdict : 'Logiciel IVD (IVDR)',
    message : '✅ Couvert par le règlement (UE) 2017/746.',
    color   : 'bg-cyan-50 border-cyan-200 text-cyan-800',
  },
};

/* Numérotation */
export const getQuestionNumber = (q: QuestionID) =>
  ({ Q1: '1', Q2: '2', Q3: '3' }[q]);
