// src/components/layout/NavBar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const pathname = usePathname();

  /* ──────────────────────────────────────────────────────────────
     1.  Masquer la navbar dans l'espace SaaS (/akrion-app)
  ────────────────────────────────────────────────────────────── */
  if (pathname.startsWith('/akrion-app')) return null;


  /* ──────────────────────────────────────────────────────────────
     3.  Détection de zone (landing / toolbox)
  ────────────────────────────────────────────────────────────── */
  const inToolbox      = pathname.startsWith('/toolbox');
  const onToolboxHome  = pathname === '/toolbox';
  const onLanding      = pathname === '/';

  // Flèche retour
  const showBack = !onLanding;
  const backHref = inToolbox
    ? onToolboxHome ? '/' : '/toolbox'
    : '/';

  /* ──────────────────────────────────────────────────────────────
     4.  Handler déconnexion (toolbox si connecté)
  ────────────────────────────────────────────────────────────── */


  /* ──────────────────────────────────────────────────────────────
     5.  Render navbar publique
  ────────────────────────────────────────────────────────────── */
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-700">
          Akrion
        </Link>

        {/* Flèche retour */}
        {showBack && (
          <Link
            href={backHref}
            aria-label="Retour"
            className="ml-auto text-indigo-600 transition hover:text-indigo-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}

        
      </div>
    </header>
  );
}
