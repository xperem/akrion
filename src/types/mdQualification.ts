/* Types partagés pour l’arbre MDCG */
export type QuestionID = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5';
export type ResultID   = 'DM' | 'NOT_DM';

export type Question = {
  text : string;                        // Texte (HTML possible)
  yes  : QuestionID | ResultID;         // Saut si réponse « Oui »
  no   : QuestionID | ResultID;         // Saut si réponse « Non »
  hint?: string;                        // Info-bulle facultative
};

export type Result = {
  verdict : string;
  message : string;
  color   : string;                     // Classes Tailwind
};

export type HistoryItem = {
  question: QuestionID;
  text    : string;
  answer  : string;                     // 'Oui' ou 'Non'
};
