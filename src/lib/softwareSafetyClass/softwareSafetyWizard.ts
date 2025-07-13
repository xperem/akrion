import { Question, QuestionID, Result, ResultID } from '@/types/softwareSafetyWizard';

/* ------------------------- Arbre de décision ------------------------- */
export const questions: Record<QuestionID, Question> = {
  /* Figure 3 : on part de la classe C par défaut */
  Q1: {
    text: 'Une situation dangereuse peut-elle résulter d’une **défaillance du logiciel** ?',
    hint: 'IEC 62304 §4.3 / Figure 3 – on part de « Class C by default »',
    yes : 'Q2',
    no  : 'CLASS_A',          // si aucune situation dangereuse possible → Classe A
  },

  Q2: {
    text: 'Après **mesures de maîtrise des risques externes** au logiciel, le risque est-il toujours inacceptable ?',
    hint: 'On ne considère ici que les mesures EXTERNES (matériel, procédures…).',
    yes : 'Q3',
    no  : 'CLASS_A',          // mesures externes suffisent → Classe A
  },

  /* ────────────────────────────── Q3 ────────────────────────────── */
Q3: {
  text: 'La défaillance pourrait-elle entraîner une **blessure grave ou le décès** ?',
  hint: 'Oui → Classe C | Non (blessure non grave) → Classe B',
  yes : 'CLASS_C',   // blessure grave / décès
  no  : 'CLASS_B',   // blessure non grave
},

};

/* ----------------------------- Résultats ----------------------------- */
export const results: Record<ResultID, Result> = {
  CLASS_A: {
    verdict : 'Classe de sécurité logicielle A',
    message : 'Aucune situation dangereuse ou risque acceptable après mesures externes.',
    color   : 'bg-green-50 border-green-200 text-green-800',
  },
  CLASS_B: {
    verdict : 'Classe de sécurité logicielle B',
    message : 'Le logiciel peut conduire à une blessure NON grave si défaillance.',
    color   : 'bg-yellow-50 border-yellow-200 text-yellow-800',
  },
  CLASS_C: {
    verdict : 'Classe de sécurité logicielle C',
    message : 'Le logiciel peut conduire à une blessure grave ou au décès en cas de défaillance.',
    color   : 'bg-red-50 border-red-200 text-red-800',
  },
};

/* Numérotation simple pour HistoryList */
export const getQuestionNumber = (id: QuestionID) =>
  ({ Q1: '1', Q2: '2', Q3: '3' }[id]);
