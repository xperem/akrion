import { Wizard }   from '@/components/decision-tree/Wizard';
import { mdConfig } from '@/lib/mdQualification/mdConfig';

export default function Page() {
  return <Wizard config={mdConfig} />;
}
