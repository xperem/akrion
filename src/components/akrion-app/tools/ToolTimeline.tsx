'use client';

import { useState, useEffect } from 'react';
import {
  HeartPulse,
  ScrollText,
  Layers3,
  ShieldCheck,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import WizardLite from '@/components/akrion-app/tools/WizardLite';

import { mdConfig }             from '@/lib/akrion-toolbox/mdQualification/mdConfig';
import { regulatoryConfig }     from '@/lib/akrion-toolbox/regulatoryQualification/regulatoryConfig';
import { classificationConfig } from '@/lib/akrion-toolbox/classification/classificationConfig';
import { softwareSafetyConfig } from '@/lib/akrion-toolbox/softwareSafetyClass/softwareSafetyConfig';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/*  Config des outils                                                 */
/* ------------------------------------------------------------------ */
const TOOLS = [
  { id: 'qualification_dm', label: 'Qualification DM',  icon: HeartPulse,  config: mdConfig          },
  { id: 'regulation',       label: 'Règlement',         icon: ScrollText,  config: regulatoryConfig  },
  { id: 'class_rule11',     label: 'Classe (règle 11)', icon: Layers3,     config: classificationConfig },
  { id: 'software_safety',  label: 'Sécurité logicielle', icon: ShieldCheck, config: softwareSafetyConfig },
] as const;

/* ------------------------------------------------------------------ */
type ResultPayload = { answers: Record<string,'yes'|'no'>; resultKey: string };
type StoredResult  = { tool: string; result: ResultPayload };

export default function ToolTimeline({
  productId,
  initialResults,
  onResultSaved, // ✅ nouvelle prop
}: {
  productId: string;
  initialResults: StoredResult[];
  onResultSaved?: (tool: string, result: ResultPayload) => void; // ✅ typée ici
}) {
  /* ---------- state ---------- */
  const [openSheet, setOpenSheet] = useState<string | null>(null);
  const [results, setResults]     = useState<StoredResult[]>(initialResults);

  // Mettre à jour les résultats quand productId ou initialResults changent
  useEffect(() => {
    setResults(initialResults);
    setOpenSheet(null); // Fermer le sheet ouvert si on change de produit
  }, [productId, initialResults]);

  const current = Object.fromEntries(
    results.map((r) => [r.tool, r.result])
  ) as Record<string, ResultPayload>;

  /* ---------- handlers ---------- */
  async function handleSave(
    toolId: string,
    answers: Record<string,'yes'|'no'>,
    resultKey: string
  ) {
    const body = { answers, resultKey };

    const res = await fetch(`/api/tools/${toolId}?product=${productId}`, {
      method:  'POST',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      toast.success('Résultat enregistré');
      setResults(prev => [
        ...prev.filter(r => r.tool !== toolId),
        { tool: toolId, result: body },
      ]);
      onResultSaved?.(toolId, body); // ✅ notification parent
      setOpenSheet(null);
    } else toast.error('Erreur serveur');
  }

  /* ---------- helpers ---------- */
  const preview = (r?: ResultPayload) => {
    if (!r) return '';
    switch (r.resultKey) {
      case 'DM':        return '✔️ Dispositif médical';
      case 'NOT_DM':    return '✖️ Pas un DM';
      default:          return r.resultKey;
    }
  };

  /* ---------- UI ---------- */
  return (
    <>
      {/* timeline verticale */}
      <ul className="relative space-y-6 border-l pl-6">
        {TOOLS.map(({ id, label, icon: Icon }) => {
          const done = current[id];
          return (
            <li key={id} className="group flex gap-4">
              <span
                className={`mt-0.5 h-4 w-4 rounded-full border
                  ${done ? 'bg-green-500' : 'bg-white'}`}
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setOpenSheet(id)}
                  className="flex items-center gap-2 text-left text-sm font-medium text-indigo-700 hover:underline"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
                {done && (
                  <p className="max-w-md text-xs text-gray-600">
                    → {preview(done)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* sheet dynamique */}
      {TOOLS.map(({ id, label, config }) =>
        openSheet === id ? (
          <Sheet key={id} open onOpenChange={() => setOpenSheet(null)}>
            <SheetContent
              side="right"
              className="
                w-full 
                max-w-[640px]      
                lg:max-w-[720px]   
                overflow-y-auto 
                bg-white/95 
                px-8 py-10
              "
            >
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-semibold">
                  {label}
                </SheetTitle>
              </SheetHeader>

              <WizardLite
                config={config}
                initial={current[id]}
                onFinish={(answers, rk) => handleSave(id, answers, rk)}
              />
            </SheetContent>
          </Sheet>
        ) : null
      )}
    </>
  );
}
