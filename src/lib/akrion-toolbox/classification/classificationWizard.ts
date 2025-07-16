/* --------------------------------------------------------------------------
 * Logique métier – Classification par la règle 11 (MDR 2017/745)
 * Basé sur MDCG 2019-11 (v2.1, mai 2023)
 * Hypothèse : le produit est déjà qualifié comme MDSW.
 * ------------------------------------------------------------------------ */
import type {
  QuestionID,
  Question,
  ResultID,
  Result,
} from '@/types/akrion-toolbox/classificationWizard';

/* ───────────────────── Questions séquentielles ───────────────────── */
export const questions: Record<QuestionID, Question> = {
  /* Q1 ─ Décision diagnostique / thérapeutique ? (sous-règle 11a) */
  Q1: {
    text: 'Le logiciel fournit-il des informations utilisées pour prendre des décisions à des fins diagnostiques ou thérapeutiques ?',
    hint:
      'Sous-règle 11a : concerne tout logiciel dont les données influencent directement un diagnostic ou un traitement.',
    yes: 'Q2',
    no : 'Q4',
  },

  /* Q2 ─ Impact létal / irréversible → III */
  Q2: {
    text: 'Une mauvaise décision fondée sur ces informations pourrait-elle entraîner le décès ou une détérioration irréversible de l’état de santé ?',
    hint:
      'Ex. mauvais dosage critique, absence de diagnostic vital. Si “Oui” → Classe III (11a-i).',
    yes: 'CLASS_III',
    no : 'Q3',
  },

  /* Q3 ─ Impact grave / chirurgie → IIb ou IIa */
  Q3: {
    text: 'Une mauvaise décision pourrait-elle entraîner une détérioration grave de la santé ou nécessiter une intervention chirurgicale ?',
    hint:
      'Ex. retard de traitement menant à chirurgie majeure. Si “Oui” → Classe IIb (11a-ii). Sinon → Classe IIa.',
    yes: 'CLASS_IIB',
    no : 'CLASS_IIA',
  },

  /* Q4 ─ Surveillance de processus physiologiques ? (11b) */
  Q4: {
    text: 'Le logiciel est-il destiné à surveiller des processus physiologiques ?',
    hint:
      'Sous-règle 11b : monitoring de paramètres physiologiques, vitaux ou non.',
    yes: 'Q5',
    no : 'CLASS_I',              // Sous-règle 11c
  },

  /* Q5 ─ Paramètres vitaux critiques ? → IIb ou IIa */
  Q5: {
    text: 'Surveille-t-il des paramètres physiologiques vitaux (ex. fréquence cardiaque, respiration, tension artérielle) dont les variations peuvent représenter un danger immédiat ?',
    hint:
      'Oui → Classe IIb (11b). Non → Classe IIa.',
    yes: 'CLASS_IIB',
    no : 'CLASS_IIA',
  },
};

/* ────────────────────────── Résultats ────────────────────────── */
export const results: Record<ResultID, Result> = {
  CLASS_I: {
    verdict : 'Classe I',
    message :
      'Le logiciel ne relève ni des décisions médicales (11a) ni de la surveillance de processus physiologiques (11b). Il est donc classé en Classe I (11c).',
    color   : 'bg-gray-50 border-gray-300 text-gray-800',
  },
  CLASS_IIA: {
    verdict : 'Classe IIa',
    message :
      'Conformément à la règle 11, le logiciel est classé en Classe IIa (décision ou surveillance sans impact critique immédiat).',
    color   : 'bg-blue-50 border-blue-300 text-blue-800',
  },
  CLASS_IIB: {
    verdict : 'Classe IIb',
    message :
      'Le logiciel est classé en Classe IIb : soit il fournit des informations pouvant conduire à une détérioration grave / chirurgie, soit il surveille des paramètres vitaux critiques.',
    color   : 'bg-orange-50 border-orange-300 text-orange-800',
  },
  CLASS_III: {
    verdict : 'Classe III',
    message :
      'Le logiciel est classé en Classe III : une erreur pourrait entraîner le décès ou une détérioration irréversible (11a-i).',
    color   : 'bg-red-50 border-red-300 text-red-800',
  },
};

/* ───────────── Numérotation lisible pour l’UI ───────────── */
export const getQuestionNumber = (q: QuestionID) =>
  ({ Q1: '1', Q2: '2', Q3: '3', Q4: '4', Q5: '5' }[q]);
