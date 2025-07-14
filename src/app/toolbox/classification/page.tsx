// app/classification/page.tsx
import { Wizard } from '@/components/decision-tree/Wizard';
import { classificationConfig } from '@/lib/classification/classificationConfig';

export const metadata = {
  title: 'Classification (règle 11) • Akrion',
  description:
    'Outil interactif pour déterminer la classe (I, IIa, IIb, III) d’un logiciel dispositif médical selon la règle 11 du MDR.',
};

export default function ClassificationPage() {
  return <Wizard config={classificationConfig} />;
}
