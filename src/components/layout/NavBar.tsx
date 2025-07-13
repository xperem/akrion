'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Navbar() {
  /*  Tableau centralisé de tous les écrans disponibles  */
  const TOOLS = [
    { href: '/md-qualification', label: 'Qualification DM' },
    { href: '/regulatory-qualification', label: 'Qualification réglementaire' },
    { href: '/classification', label: 'Classification (règle 11)' },
    { href: '/ressources', label: 'Ressources utiles' },
    { href: '/checklist/documentation-mdr',  label: 'Checklist doc. MDR' },
    { href: '/checklist/documentation-ivdr', label: 'Checklist doc. IVDR' },
  ];

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo / lien accueil */}
        <Link href="/" className="text-xl font-bold text-indigo-700">
          Akrion
        </Link>

        {/* ----------- Mobile : menu latéral ----------- */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="pt-16 w-64">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="font-medium" prefetch={false}>
                Accueil
              </Link>

              {TOOLS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-medium"
                  prefetch={false}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
