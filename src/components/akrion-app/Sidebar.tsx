'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Wand2,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

export default function Sidebar() {
  const pathname = usePathname();

  /** renvoie `true` si la route courante correspond au lien */
  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname.startsWith(href);

  /* -------------------------------------------------- */
  /*                       UI                           */
  /* -------------------------------------------------- */
  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-60 border-r bg-white/90 backdrop-blur-lg">
      <div className="flex h-full flex-col px-4 py-6">
        {/* ───── Logo + retour site ───── */}
        <div className="mb-8 flex items-center">
          <h1 className="flex-1 select-none text-2xl font-extrabold tracking-tight text-indigo-700">
            Akrion
          </h1>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                aria-label="Retour au site public"
                className="
                  inline-flex h-10 w-10 items-center justify-center rounded-lg
                  text-gray-500 transition
                  hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-indigo-600
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                "
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Retour au site
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ───── Navigation principale ───── */}
        <nav className="flex-1 space-y-2">
          {/* Dashboard */}
          <Link
            href="/akrion-app/dashboard"
            className={`
              flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
              ${isActive('/akrion-app/dashboard')
                ? 'bg-indigo-50 font-medium text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'}
            `}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>

          {/* Outils */}
          <Link
            href="/akrion-app/tools"
            className={`
              flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
              ${isActive('/akrion-app/tools')
                ? 'bg-indigo-50 font-medium text-indigo-700'
                : 'text-gray-700 hover:bg-gray-50'}
            `}
          >
            <Wand2 className="h-5 w-5" />
            Outils
          </Link>
        </nav>

        {/* ───── Déconnexion ───── */}
        <form action="/akrion-app/logout" method="post" className="pt-6">
          <button
            className="
              flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm
              text-gray-600 transition hover:bg-gray-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
            "
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
