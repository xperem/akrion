// app/page.tsx
import Link from 'next/link';
import { ToolCaseIcon, BriefcaseBusiness } from 'lucide-react';

export default function Landing() {
  const SECTIONS = [
    {
      href : '/toolbox',
      title: 'Akrion Toolbox',
      desc : 'Utilisez gratuitement nos mini-outils de qualification & classification.',
      icon : ToolCaseIcon,
    },
    {
      href : '/akrion-app',
      title: 'Akrion App',
      desc : 'Le SaaS de référence pour la préparation de votre certification.',
      icon : ToolCaseIcon,
    },
    {
      href : '/consulting',
      title: 'Akrion Consulting',
      desc : 'Besoin d’un expert QARA ? Découvrez mes services d’accompagnement.',
      icon : BriefcaseBusiness,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* --------- Hero --------- */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4">Bienvenue sur Akrion</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          La plateforme tout-en-un pour la conformité des logiciels dispositifs
          médicaux : outils et expertise QARA.
        </p>
      </section>

      {/* --------- Cartes -------- */}
      <section
        className="
          flex flex-col sm:flex-row                /* colonne → ligne dès 640 px */
          justify-center items-stretch gap-10      /* centrage + écart stable   */
          max-w-4xl mx-auto
        "
      >
        {SECTIONS.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="
              group relative flex flex-col justify-between
              rounded-2xl border border-gray-200 bg-white
              p-8 transition
              max-w-xs w-full                       /* largeur cohérente        */
              hover:shadow-xl hover:-translate-y-1  /* petit lift au survol     */
            "
          >
            <div>
              <Icon className="w-10 h-10 text-indigo-600 mb-5 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-semibold mb-3">{title}</h3>
            </div>
            <p className="text-sm text-gray-600">{desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
