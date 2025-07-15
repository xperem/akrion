import { ReactNode } from 'react';

export default function ToolboxLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-6xl px-4 pt-[8vh] pb-12">
      {children}
    </main>
  );
}
