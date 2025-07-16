import { Wizard } from '@/components/akrion-toolbox/decision-tree/Wizard';
import { regulatoryConfig } from '@/lib/akrion-toolbox/regulatoryQualification/regulatoryConfig';

export default function Page() {
  return <Wizard config={regulatoryConfig} />;
}
