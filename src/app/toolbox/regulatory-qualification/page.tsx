import { Wizard } from '@/components/akrion-toolbox/decision-tree/Wizard';
import { regulatoryConfig } from '@/lib/regulatoryQualification/regulatoryConfig';

export default function Page() {
  return <Wizard config={regulatoryConfig} />;
}
