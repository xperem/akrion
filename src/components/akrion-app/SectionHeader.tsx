// components/akrion-app/SectionHeader.tsx
import { ReactNode } from 'react';

export default function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}
