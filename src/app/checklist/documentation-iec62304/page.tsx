import docTech from '@/lib/checklist/docTechChecklist-iec62304.json';
import { ChecklistWizard } from '@/components/checklist/ChecklistWizard';

export const metadata = {
  title: 'Checklist Documentation technique • Akrion',
};

export default function DocumentationChecklistPage() {
  return <ChecklistWizard checklist={docTech} />;
}
