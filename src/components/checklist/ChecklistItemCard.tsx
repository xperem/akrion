'use client';

import { FC, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

/* ---- Types ---- */
type AnswerValue = 'yes' | 'no' | 'na';

type Props = {
  itemId        : string;
  title         : string;
  description   : string;
  regulationRef : string;
  onAnswer      : (answer: AnswerValue, proof?: string) => void;
  defaultValue ?: { answer: AnswerValue; proof?: string };
};

/* ---- Composant ---- */
export const ChecklistItemCard: FC<Props> = ({
  itemId,
  title,
  description,
  regulationRef,
  onAnswer,
  defaultValue,
}) => {
  /* ----- State ----- */
  const [answer, setAnswer] = useState<AnswerValue | null>(
    defaultValue?.answer ?? null
  );
  const [proof,  setProof ] = useState(defaultValue?.proof ?? '');

  /* ----- Choix d’une réponse ----- */
  const choose = (a: AnswerValue) => {
    setAnswer(a);

    // si Oui -> garder la preuve actuelle
    // si Non ou N/A -> vider la preuve
    const p = a === 'yes' ? proof : undefined;
    if (a !== 'yes') setProof('');

    onAnswer(a, p);
  };

  /* ----- Saisie de preuve quand Oui ----- */
  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProof(val);
    if (answer === 'yes') onAnswer('yes', val);
  };

  /* ----- UI ----- */
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm space-y-3 max-w-[850px]">
      {/* Titre & description */}
      <div>
        <h4 className="font-semibold">
          {itemId} — {title}
        </h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {/* Référence réglementaire */}
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <ArrowUpRight className="w-3 h-3" />
        {regulationRef}
      </p>

      {/* Boutons Oui / Non / N-A */}
      <div className="flex gap-3">
        <button
          onClick={() => choose('yes')}
          className={`px-4 py-2 rounded-lg text-white transition ${
            answer === 'yes' ? 'bg-green-600' : 'bg-green-500/60'
          }`}
        >
          Oui
        </button>

        <button
          onClick={() => choose('no')}
          className={`px-4 py-2 rounded-lg text-white transition ${
            answer === 'no' ? 'bg-red-600' : 'bg-red-500/60'
          }`}
        >
          Non
        </button>

        <button
          onClick={() => choose('na')}
          className={`px-4 py-2 rounded-lg text-white transition ${
            answer === 'na' ? 'bg-gray-600' : 'bg-gray-500/60'
          }`}
        >
          N/A
        </button>
      </div>

      {/* Champ “preuve” visible seulement si Oui */}
      {answer === 'yes' && (
        <input
          type="text"
          placeholder="Référence / preuve…"
          value={proof}
          onChange={handleProofChange}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      )}
    </div>
  );
};
