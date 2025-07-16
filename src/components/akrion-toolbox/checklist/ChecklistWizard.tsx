'use client';

import { useState } from 'react';
import { Checklist } from '@/types/akrion-toolbox/checklist';
import { ChecklistItemCard } from './ChecklistItemCard';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ---------- Types ---------- */
type AnswerValue = 'yes' | 'no' | 'na';
type AnswerMap   = Record<string, { answer: AnswerValue; proof?: string }>;

export function ChecklistWizard({ checklist }: { checklist: Checklist }) {
  /* ---------- State ---------- */
  const [answers, setAnswers] = useState<AnswerMap>({});

  const total      = checklist.sections.flatMap(s => s.items).length;
  const answered   = Object.keys(answers).length;          // Oui + Non + N-A
  const yesCount   = Object.values(answers).filter(a => a.answer === 'yes').length;
  const naCount    = Object.values(answers).filter(a => a.answer === 'na').length;

  const pctDone    = Math.round((answered / total) * 100);
  const pctYes     = Math.round((yesCount  / total) * 100);
  const pctNA      = Math.round((naCount   / total) * 100);

  /* ---------- Handlers ---------- */
  const updateAnswer = (id: string, answer: AnswerValue, proof?: string) =>
    setAnswers(prev => ({ ...prev, [id]: { answer, proof } }));

  /* ---------- PDF export ---------- */
  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(checklist.title, 14, 20);

    /* Tableau détaillé */
    const rows = checklist.sections.flatMap(sec =>
      sec.items.map(it => {
        const a = answers[it.id];
        const rep = a
          ? a.answer === 'yes'
            ? 'Oui'
            : a.answer === 'no'
            ? 'Non'
            : 'N/A'
          : '—';

        return [it.id, it.title, rep, a?.proof ?? ''];
      })
    );

    autoTable(doc, {
      head: [['ID', 'Intitulé', 'Réponse', 'Preuve']],
      body: rows,
      startY: 30,
      styles: { fontSize: 8 },
      columnStyles: { 1: { cellWidth: 70 } },
    });

    const y = (doc as any).lastAutoTable.finalY || 40;
    doc.text(
      `Complétude ${pctDone}% | Oui ${pctYes}% | N-A ${pctNA}%`,
      14,
      y + 10
    );

    doc.save(`${checklist.id}-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  /* ---------- UI ---------- */
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-800">{checklist.title}</h1>
          <p className="text-gray-600">{checklist.subtitle}</p>
          <p className="text-sm text-gray-500">{checklist.intro}</p>
        </header>

        {/* Sticky bar */}
        <div className="sticky top-16 z-10 bg-white/90 backdrop-blur-sm rounded-md shadow px-4 py-2 border border-indigo-200">
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            {/* Complétude */}
            <div className="absolute inset-0 bg-indigo-600" style={{ width: `${pctDone}%` }} />
            {/* Oui */}
            <div className="absolute inset-0 bg-green-500"  style={{ width: `${pctYes}%` }} />
            {/* N-A (grisé) */}
            <div className="absolute inset-0 bg-gray-500/70" style={{ width: `${pctNA}%` }} />
          </div>
          <p className="text-sm text-center text-gray-700 mt-1">
            Répondu&nbsp;: {answered}/{total} – {pctDone}% &nbsp;|&nbsp;
            Oui&nbsp;: {yesCount} – {pctYes}% &nbsp;|&nbsp;
            N-A&nbsp;: {naCount} – {pctNA}%
          </p>
        </div>

        {/* Sections */}
        {checklist.sections.map(section => (
          <section key={section.id} className="space-y-6">
            <h2 className="text-xl font-semibold text-indigo-700">
              {section.id}. {section.title}
            </h2>
            <div className="space-y-4">
              {section.items.map(it => (
                <ChecklistItemCard
                  key={it.id}
                  itemId={it.id}
                  title={it.title}
                  description={it.description}
                  regulationRef={it.regulationRef}
                  onAnswer={(ans, proof) => updateAnswer(it.id, ans as AnswerValue, proof)}
                  defaultValue={answers[it.id]}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Export */}
        <div className="text-center">
          <button
            onClick={exportPdf}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Exporter la checklist en PDF
          </button>
        </div>
      </div>
    </main>
  );
}
