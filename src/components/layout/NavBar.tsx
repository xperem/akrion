'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  // État : utilisateur connecté ?
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setLoggedIn(!!session);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setLoggedIn(!!session);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Zones : où est-on ?
  const inToolbox     = pathname.startsWith('/toolbox');
  const inSaaS        = pathname.startsWith('/akrion-app');
  const onToolboxHome = pathname === '/toolbox';
  const onLanding     = pathname === '/';

  // Flèche retour
  const showBack = !onLanding;
  let backHref = '/';

  if (inToolbox) {
    backHref = onToolboxHome ? '/' : '/toolbox';
  } else if (inSaaS) {
    backHref = '/'; // on sort du SaaS pour revenir à la landing globale
  }

  // Handler déconnexion
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/akrion-app');
    router.refresh();
  }

  // Render
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

        {/* Bouton déconnexion si dans le SaaS et connecté */}
        {inSaaS && loggedIn && (
          <button
            onClick={handleLogout}
            className="ml-4 rounded-lg border border-indigo-600 px-4 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
          >
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
}
