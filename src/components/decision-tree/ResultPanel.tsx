'use client';

import { FC } from 'react';
import { CheckCircle, Info, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ───── Types chaudières ───── */
type Result = {
  verdict : string;
  message : string;
  color   : string;
};

type HistoryItem<Q extends string> = {
  question: Q;
  text    : string;
  answer  : string;
};

type Props<Q extends string> = {
  result    : Result;
  history   : HistoryItem<Q>[];
  onRestart : () => void;
  /* ↓↓↓ nouveaux props ↓↓↓ */
  docTitle  : string;          // ex. "Rapport de classification Règle 11"
  fileName  : string;          // ex. "classification-regle11.pdf"
};

/* ───── Helpers ───── */
const clean = (html: string) =>
  html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const isPositive = (verdict: string) => !/produit\s+non\s+dm/i.test(verdict);

/* ───── Composant ───── */
export function ResultPanel<Q extends string>({
  result,
  history,
  onRestart,
  docTitle,
  fileName,
}: Props<Q>) {
  const exportPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(docTitle, 14, 20);

    autoTable(doc, {
      head   : [['#', 'Question', 'Réponse']],
      body   : history.map((item, i) => [i + 1, clean(item.text), item.answer]),
      startY : 30,
      styles : { fontSize: 10 },
      columnStyles: { 1: { cellWidth: 120 } },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.setTextColor(isPositive(result.verdict) ? '#16a34a' : '#dc2626');
    doc.text(`Verdict final : ${result.verdict}`, 14, finalY + 15);

    doc.save(fileName);
  };

  return (
    <div className={`wizard-card w-full max-w-[800px] mx-auto bg-white rounded-lg shadow-lg p-6 border-2 ${result.color}`}>
      <div className="text-center space-y-6">
        {isPositive(result.verdict)
          ? <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
          : <Info        className="w-16 h-16 mx-auto text-blue-600"  />
        }

        <h3 className="text-2xl font-bold">{result.verdict}</h3>
        <p className="text-base sm:text-lg">{result.message}</p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button
            onClick={onRestart}
            className="w-full sm:w-[200px] px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Nouvelle évaluation
          </button>

          <button
            onClick={exportPdf}
            className="w-full sm:w-[200px] flex items-center justify-center gap-2 px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium"
          >
            <Download className="w-4 h-4" />
            Exporter en PDF
          </button>
        </div>
      </div>
    </div>
  );
}
