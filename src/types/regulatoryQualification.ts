/* Types – Wizard « Qualification réglementaire » */

export type QuestionID = 'Q1' | 'Q2' | 'Q3';
export type ResultID   = 'MDR' | 'IVDR';

export type Question = {
  text : string;                       // HTML autorisé
  yes  : QuestionID | ResultID;
  no   : QuestionID | ResultID;
  hint?: string;                       // info supplémentaire (définitions, etc.)
};

export type Result = {
  verdict : string;
  message : string;
  color   : string;                    // classes Tailwind
};

export type HistoryItem = {
  question: QuestionID;
  text    : string;
  answer  : string;                    // 'Oui' ou 'Non'
};
