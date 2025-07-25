import { Wizard } from '@/components/akrion-toolbox/decision-tree/Wizard';
import { softwareSafetyConfig } from '@/lib/akrion-toolbox/softwareSafetyClass/softwareSafetyConfig';

export const metadata = {
  title: 'Classification sécurité logicielle • Akrion',
  description:
    'Outil interactif pour déterminer la classe A, B ou C selon IEC 62304.',
};

export default function SoftwareSafetyPage() {
  return <Wizard config={softwareSafetyConfig} />;
}
