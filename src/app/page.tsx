import Link from 'next/link';
import {
  HeartPulse,
  ScrollText,
  Layers3,
  BookOpen,
  ClipboardList,
  CircuitBoard,
  ShieldCheck,
} from 'lucide-react';

const TOOLS = [
  {
    href : '/md-qualification',
    title: 'Qualification DM',
    desc : 'Déterminez si votre logiciel est un Dispositif Médical.',
    icon : HeartPulse,
  },
  {
    href : '/regulatory-qualification',
    title: 'Qualification réglementaire',
    desc : 'Déterminez si votre logiciel relève du règlement MDR ou IVDR.',
    icon : ScrollText,
  },
  {
    href : '/classification',
    title: 'Classification (règle 11)',
    desc : 'Identifiez la classe (I / IIa / IIb / III) de votre MDSW.',
    icon : Layers3,
  },
  {
    href : '/ressources',
    title: 'Ressources utiles',
    desc : 'Liens utiles dans votre parcours réglementaire.',
    icon : BookOpen,
  },
  {
  href : '/software-safety',
  title: 'Classification sécurité logicielle (IEC 62304)',
  desc : 'Attribuez la classe A / B / C de votre logiciel.',
  icon : CircuitBoard,   // ou une autre icône déjà dispo
},

];

export default function Home() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="text-center py-14">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur Akrion</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          La boîte à outils pour la conformité des logiciels dispositifs médicaux&nbsp;:
          qualification, classification, documentation et plus encore.
        </p>
      </section>

       

      {/* Grille */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col justify-between rounded-xl border border-gray-200
                       bg-white p-6 hover:shadow-lg transition min-h-[220px] sm:min-h-[200px]"
          >
            <div>
              <Icon className="w-8 h-8 text-indigo-600 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">{desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
