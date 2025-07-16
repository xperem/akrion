import { Wizard }   from '@/components/akrion-toolbox/decision-tree/Wizard';
import { mdConfig } from '@/lib/akrion-toolbox/mdQualification/mdConfig';

export default function Page() {
  return <Wizard config={mdConfig} />;
}
