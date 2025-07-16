// components/akrion-app/PageShell.tsx
import { ReactNode } from 'react';

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 pt-[10vh] pb-24">
      {/* Conteneur à largeur limitée pour garder le contenu lisible */}
      <div className="w-full max-w-5xl">{children}</div>
    </main>
  );
}
