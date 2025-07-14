import { resourceLinks } from '@/lib/resource/resourceLinks';
import { ResourceCard } from '@/components/resource/ResourceCard';

export const metadata = {
  title: 'Ressources utiles • Akrion',
  description: 'Liens vers les textes légaux, guides MDCG et sites officiels.',
};

export default function ResourcePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">📚 Ressources utiles</h1>
          <p className="text-gray-600">
            Voici une sélection de liens vers les textes réglementaires et guidances européennes.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {resourceLinks.map((link) => (
            <ResourceCard
              key={link.id}
              title={link.title}
              description={link.description}
              url={link.url}
              source={link.source}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
