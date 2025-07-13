import docTech from '@/lib/checklist/docTechChecklist-ivdr.json';
import { ChecklistWizard } from '@/components/checklist/ChecklistWizard';

export const metadata = {
  title: 'Checklist Documentation technique • Akrion',
};

export default function DocumentationChecklistPage() {
  return <ChecklistWizard checklist={docTech} />;
}
