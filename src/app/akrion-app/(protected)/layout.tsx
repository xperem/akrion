// app/akrion-app/(protected)/layout.tsx
import { ReactNode } from 'react';
import Sidebar from '@/components/akrion-app/Sidebar';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-56 flex-1 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
        {children}
      </div>
    </div>
  );
}
