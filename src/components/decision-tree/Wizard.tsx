'use client';

import { useState } from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { ProgressBar }   from '@/components/decision-tree/ProgressBar';
import { QuestionCard }  from '@/components/decision-tree/QuestionCard';
import { ResultPanel }   from '@/components/decision-tree/ResultPanel';
import { HistoryList }   from '@/components/decision-tree/HistoryList';
import { WizardLayout }  from '@/components/layout/wizardLayout';
import { WizardConfig }  from '@/types/wizardConfig';

/* ─────────── Types ─────────── */
type HistoryItem<Q extends string> = {
  question: Q;
  text: string;
  answer: string;
};

type Props<
  Q  extends string,
  R  extends string,
  QT extends { text: string; yes: Q | R; no: Q | R; hint?: string },
  RT extends { verdict: string; message: string; color: string }
> = { config: WizardConfig<Q, R, QT, RT> };

export function Wizard<
  Q  extends string,
  R  extends string,
  QT extends { text: string; yes: Q | R; no: Q | R; hint?: string },
  RT extends { verdict: string; message: string; color: string }
>({ config }: Props<Q, R, QT, RT>) {

  /* ---------- State ---------- */
  const [current, setCurrent] = useState<Q | null>('Q1' as Q);
  const [history, setHistory] = useState<HistoryItem<Q>[]>([]);
  const [result , setResult ] = useState<RT | null>(null);
  const stepsDone             = result ? config.total : history.length;

  /* ---------- Utilitaire ---------- */
  const getQuestionNumber = (id: Q) => id.replace(/^Q/i, '').toLowerCase();

  /* ---------- Handlers ---------- */
  const answer = (a: 'yes' | 'no') => {
    if (!current) return;
    const q    = config.questions[current];
    const next = (a === 'yes' ? q.yes : q.no) as Q | R;

    setHistory(h => [...h, { question: current, text: q.text, answer: a === 'yes' ? 'Oui' : 'Non' }]);

    if (next in config.results) {
      setResult(config.results[next as R]);
      setCurrent(null);
    } else {
      setCurrent(next as Q);
    }
  };

  const goBack = () => {
    setHistory(h => {
      const nh = [...h];
      const last = nh.pop();
      if (last) setCurrent(last.question);
      return nh;
    });
    setResult(null);
  };

  const restart = () => {
    setCurrent('Q1' as Q);
    setHistory([]);
    setResult(null);
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Tout le contenu est désormais dans le même conteneur max-w : */}
      <div className="w-full max-w-[800px] mx-auto space-y-6">

        {/* ------ En-tête ------ */}
        <header className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold">{config.title}</h1>
              <p className="text-gray-600">{config.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
            <AlertCircle className="inline w-4 h-4 mr-2 text-blue-600" />
            {config.intro}
          </p>
        </header>

        {/* ------ Progression ------ */}
        <section className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span>Progression</span>
            {result ? (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Finalisé
              </span>
            ) : (
              <span>{stepsDone}/{config.total} questions</span>
            )}
          </div>
          <ProgressBar value={stepsDone} max={config.total} />
        </section>

        {/* ------ Zone dynamique ------ */}
        <WizardLayout className="mt-8">
          {current ? (
            <QuestionCard
              questionNumber={getQuestionNumber(current)}
              questionText={config.questions[current].text}
              hint={config.questions[current].hint}
              onAnswer={answer}
              canBack={history.length > 0}
              onBack={goBack}
            />
          ) : (
            result && (
              <ResultPanel
                result={result}
                history={history}
                onRestart={restart}
                docTitle={`Rapport de ${config.title}`}
                fileName={`${config.title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
              />
            )
          )}

          <HistoryList
            history={history}
            getQuestionNumber={getQuestionNumber}
          />
        </WizardLayout>
      </div>
    </div>
  );
}
