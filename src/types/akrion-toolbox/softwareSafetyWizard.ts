export type QuestionID = 'Q1' | 'Q2' | 'Q3';
export type ResultID   = 'CLASS_A' | 'CLASS_B' | 'CLASS_C';

export type Question = {
  text : string;
  hint?: string;
  yes  : QuestionID | ResultID;   // branche « Oui »
  no   : QuestionID | ResultID;   // branche « Non »
};

export type Result = {
  verdict : string;      // Classe finale
  message : string;      // Court texte explicatif
  color   : string;      // Couleur BG + bordure pour ResultPanel
};
