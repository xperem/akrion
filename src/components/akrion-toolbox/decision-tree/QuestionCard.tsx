'use client';

import { FC } from 'react';
import { ChevronLeft } from 'lucide-react';

type Props = {
  questionNumber: string;
  questionText : string;
  onAnswer     : (a: 'yes' | 'no') => void;
  canBack      : boolean;
  onBack       : () => void;
  hint?        : string;
};

export const QuestionCard: FC<Props> = ({
  questionNumber,
  questionText,
  onAnswer,
  canBack,
  onBack,
  hint,
}) => (
  <div className="wizard-card bg-white rounded-lg shadow-lg p-6 space-y-8 w-full max-w-[800px] mx-auto">
    {/* En-tête */}
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        Question&nbsp;{questionNumber}
      </h2>

      {canBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </button>
      )}
    </div>

    {/* Intitulé */}
    <p
      className="text-xl text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: questionText }}
    />

    {/* Définition / Hint */}
    {hint && (
      <div
        className="text-sm bg-blue-50 text-blue-900 border border-blue-200 rounded-lg p-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: hint }}
      />
    )}

    {/* Boutons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => onAnswer('yes')}
        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full sm:w-[160px]"
      >
        Oui
      </button>
      <button
        onClick={() => onAnswer('no')}
        className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full sm:w-[160px]"
      >
        Non
      </button>
    </div>
  </div>
);
