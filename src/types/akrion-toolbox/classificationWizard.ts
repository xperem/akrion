export type QuestionID =
  | 'Q1'
  | 'Q2'
  | 'Q3'
  | 'Q4'
  | 'Q5';

export type ResultID = 'CLASS_I' | 'CLASS_IIA' | 'CLASS_IIB' | 'CLASS_III';

export type Question = {
  text : string;
  yes  : QuestionID | ResultID;
  no   : QuestionID | ResultID;
  hint?: string;
};

export type Result = {
  verdict: string;
  message: string;
  color  : string; // tailwind: border-green-600, etc.
};
