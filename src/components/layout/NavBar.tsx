'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  /* ─────────── Zones détectées ─────────── */
  const inToolbox      = pathname.startsWith('/toolbox');
  const onToolboxHome  = pathname === '/toolbox';
  const onLanding      = pathname === '/';

  /* Affiche-t-on la flèche ? */
  const showBack = !onLanding;                     // partout sauf sur la landing

  /* Où pointe la flèche ? */
  let backHref: string;
  if (inToolbox) {
    backHref = onToolboxHome ? '/' : '/toolbox';   // racine toolbox ➜ landing, sinon ➜ racine toolbox
  } else {
    backHref = '/';                                // autres pages ➜ landing
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl flex items-center gap-4 px-4 py-3">
        {/* Logo / lien landing */}
        <Link href="/" className="text-xl font-bold text-indigo-700">
          Akrion
        </Link>

        {showBack && (
          <Link
            href={backHref}
            aria-label="Retour"
            className="ml-auto text-indigo-600 hover:text-indigo-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}
      </div>
    </header>
  );
}
