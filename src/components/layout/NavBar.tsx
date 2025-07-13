'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const showBack = pathname !== '/';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        {/* Logo à gauche */}
        <Link href="/" className="text-xl font-bold text-indigo-700">
          Akrion
        </Link>

        {/* Flèche de retour visible uniquement hors page d’accueil */}
        {showBack && (
          <Link
            href="/"
            aria-label="Retour à l’accueil"
            className="text-indigo-600 hover:text-indigo-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
      </div>
    </header>
  );
}
