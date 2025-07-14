// app/page.tsx
import Link from 'next/link';
import {
  ToolCaseIcon,
  Workflow,
  BriefcaseBusiness,
} from 'lucide-react';

export default function Landing() {
  const SECTIONS = [
    {
      href: '/toolbox',
      title: 'Akrion Toolbox',
      desc: 'Utilisez gratuitement nos mini-outils de qualification & classification.',
      icon: ToolCaseIcon,
    },
    {
      href: '/akrion-app',
      title: 'Akrion App',
      desc: 'Créez vos produits, suivez une roadmap de certification complète (MVP bientôt).',
      icon: Workflow,
    },
    {
      href: '/consulting',
      title: 'Akrion Consulting',
      desc: 'Besoin d’un expert QARA ? Découvrez mes services d’accompagnement.',
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4">Bienvenue sur Akrion</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          La plateforme tout-en-un pour la conformité des logiciels dispositifs
          médicaux : outils gratuits, application de suivi et expertise QARA.
        </p>
      </section>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {SECTIONS.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white
                       p-6 hover:shadow-lg transition min-h-[220px]"
          >
            <div>
              <Icon className="w-10 h-10 text-indigo-600 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            </div>
            <p className="text-sm text-gray-600">{desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
