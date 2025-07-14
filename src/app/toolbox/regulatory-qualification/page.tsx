import { Wizard } from '@/components/decision-tree/Wizard';
import { regulatoryConfig } from '@/lib/regulatoryQualification/regulatoryConfig';

export default function Page() {
  return <Wizard config={regulatoryConfig} />;
}
