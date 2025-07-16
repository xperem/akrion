'use client';

import { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';

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
  inSheet?: boolean; // ✅ Nouvelle prop pour détecter si on est dans un Sheet
};

/* ------------------------------------------------------------------ */
export default function WizardLite({ config, onFinish, initial, inSheet = false }: Props) {
  const [answers, setAnswers] = useState<Record<string,'yes'|'no'>>(initial?.answers ?? {});
  
  // Si on a des réponses initiales, afficher directement le résultat
  const [current, setCurrent] = useState<string | null>(() => {
    if (initial?.answers && Object.keys(initial.answers).length > 0 && initial?.resultKey) {
      return null; // Afficher directement le résultat
    }
    return 'Q1'; // Sinon commencer par Q1
  });
  
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

  // Fonction pour éditer/reprendre l'outil avec les réponses existantes
  const editTool = () => {
    // Reprendre depuis la première question mais garder les réponses visibles dans l'historique
    setCurrent('Q1');
    setResultKey(null);
  };

  const mappedHistory = Object.entries(answers).map(([qId,a]) => ({
    question: qId,
    text:     config.questions[qId]?.text || `Question ${qId}`,
    answer:   a === 'yes' ? 'Oui' : 'Non',
  }));

  // Déterminer si on affiche un indicateur de pré-remplissage
  const hasInitialData = initial?.answers && Object.keys(initial.answers).length > 0;

  /* ----- ui ----- */
  return (
    <div className={
      inSheet 
        ? "space-y-6" // ✅ Pas de fond ni padding si dans un Sheet
        : "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" // ✅ Style complet si standalone
    }>
      <div className={inSheet ? "space-y-6" : "mx-auto w-full max-w-[900px] space-y-6"}>
        {/* en‑tête ----------------------------------------------------- */}
        <header className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{config.title}</h1>
              <p className="text-gray-600">{config.subtitle}</p>
            </div>
            
            {/* Indicateur de pré-remplissage */}
            {hasInitialData && (
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span>Résultat précédent chargé</span>
              </div>
            )}
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
            <div className="space-y-6">
              <ResultPanel
                result={config.results[resultKey]}
                history={mappedHistory}
                onRestart={restart}
                docTitle={`Rapport – ${config.title}`}
                fileName={`${config.title.toLowerCase().replace(/\s+/g,'-')}.pdf`}
              />
              
              {/* Actions supplémentaires quand on a un résultat */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Bouton pour modifier les réponses (si on a un historique) */}
                  {mappedHistory.length > 0 && (
                    <button
                      onClick={editTool}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Modifier les réponses
                    </button>
                  )}
                  
                  {/* Bouton recommencer */}
                  <button
                    onClick={restart}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Nouvelle évaluation
                  </button>
                </div>
                
                {/* Info sur la dernière évaluation */}
                {hasInitialData && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Résultat précédent :</strong> Cette évaluation a été chargée depuis vos données sauvegardées. 
                      Vous pouvez la modifier ou refaire une nouvelle évaluation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Historique des réponses */}
          {mappedHistory.length > 0 && (
            <HistoryList
              history={mappedHistory}
              getQuestionNumber={getNum}
            />
          )}
        </WizardLayout>
      </div>
    </div>
  );
}