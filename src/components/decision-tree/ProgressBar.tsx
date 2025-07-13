/* src/components/ProgressBar.tsx */
import { FC } from 'react';

type Props = { value: number; max: number };

export const ProgressBar: FC<Props> = ({ value, max }) => {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      {/* transition-[width] = nouvelle util Tailwind v3.4 */}
      <div
        className="h-full bg-indigo-600 transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
