'use client';

import { useState } from 'react';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

import { ProgressBar }  from '@/components/akrion-toolbox/decision-tree/ProgressBar';
import { QuestionCard } from '@/components/akrion-toolbox/decision-tree/QuestionCard';
import { ResultPanel }  from '@/components/akrion-toolbox/decision-tree/ResultPanel';
import { HistoryList }  from '@/components/akrion-toolbox/decision-tree/HistoryList';
import { WizardLayout } from '@/components/akrion-toolbox/layout/wizardLayout';

/* ------------------------------------------------------------------ */
export type LiteWizardConfig = {
  title: string;
  subtitle: string;
  intro: string;
  total: number;
  questions: Record<string,{ text: string; yes: string; no: string; hint?: string }>;
  results:   Record<string,{ verdict: string; message: string; color: string }>;
};

type Props = {
  config: LiteWizardConfig;
  onFinish: (answers: Record<string,'yes'|'no'>, resultKey: string) => void;
  initial?: { answers: Record<string,'yes'|'no'>; resultKey: string };
};

/* ------------------------------------------------------------------ */
export default function WizardLite({ config, onFinish, initial }: Props) {
  const [answers,   setAnswers]   = useState<Record<string,'yes'|'no'>>(initial?.answers ?? {});
  const [current,   setCurrent]   = useState<string | null>(initial ? null : 'Q1');
  const [resultKey, setResultKey] = useState<string | null>(initial?.resultKey ?? null);

  const stepDone = Object.keys(answers).length;
  const getNum   = (id: string) => id.replace(/^Q/i,'');

  /* ----- actions ----- */
  const answer = (a: 'yes' | 'no') => {
    if (!current) return;
    const q    = config.questions[current];
    const next = a === 'yes' ? q.yes : q.no;

    const nextAnswers = { ...answers, [current]: a };
    setAnswers(nextAnswers);

    if (next in config.results) {
      setCurrent(null);
      setResultKey(next);
      onFinish(nextAnswers, next);
    } else {
      setCurrent(next);
    }
  };

  const back = () => {
    const keys = Object.keys(answers);
    if (!keys.length) return;
    const lastKey = keys[keys.length - 1];
    const { [lastKey]: _, ...rest } = answers;
    setAnswers(rest);
    setCurrent(lastKey);
    setResultKey(null);
  };

  const restart = () => {
    setAnswers({});
    setCurrent('Q1');
    setResultKey(null);
  };

  const mappedHistory = Object.entries(answers).map(([qId,a]) => ({
    question: qId,
    text:     config.questions[qId].text,
    answer:   a === 'yes' ? 'Oui' : 'Non',
  }));

  /* ----- ui ----- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto w-full max-w-[900px] space-y-6">
        {/* en‑tête ----------------------------------------------------- */}
        <header className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold">{config.title}</h1>
              <p className="text-gray-600">{config.subtitle}</p>
            </div>
          </div>
          <p className="rounded-lg bg-blue-50 p-3 text-sm text-gray-700">
            <AlertCircle className="mr-2 inline h-4 w-4 text-blue-600" />
            {config.intro}
          </p>
        </header>

        {/* progression ------------------------------------------------ */}
        <section className="rounded-lg bg-white p-4 shadow">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Progression</span>
            {resultKey ? (
              <span className="flex items-center gap-1 font-medium text-green-600">
                <CheckCircle className="h-4 w-4" />
                Finalisé
              </span>
            ) : (
              <span>{stepDone}/{config.total} questions</span>
            )}
          </div>
          <ProgressBar value={resultKey ? config.total : stepDone} max={config.total} />
        </section>

        {/* corps ------------------------------------------------------ */}
        <WizardLayout className="mt-8">
          {current ? (
            <QuestionCard
              questionNumber={getNum(current)}
              questionText={config.questions[current].text}
              hint={config.questions[current].hint}
              onAnswer={answer}
              canBack={stepDone > 0}
              onBack={back}
            />
          ) : resultKey ? (
            <ResultPanel
              result={config.results[resultKey]}
              history={mappedHistory}
              onRestart={restart}
              docTitle={`Rapport – ${config.title}`}
              fileName={`${config.title.toLowerCase().replace(/\s+/g,'-')}.pdf`}
            />
          ) : null}

          <HistoryList
            history={mappedHistory}
            getQuestionNumber={getNum}
          />
        </WizardLayout>
      </div>
    </div>
  );
}
