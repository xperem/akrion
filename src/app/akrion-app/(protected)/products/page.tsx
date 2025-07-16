import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  created_at: string;
};

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/akrion-app/login');

  const { data: products } = await supabase
    .from('products')
    .select('id, name, created_at')
    .order('created_at', { ascending: false });

  return (
    <section className="space-y-6 px-4 py-10">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mes produits</h1>
        <Link
          href="/akrion-app/products/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          + Nouveau produit
        </Link>
      </header>

      <ul className="space-y-4">
        {products && products.map((p: Product) => (
          <li key={p.id} className="rounded-lg border bg-white/80 p-4 shadow">
            <h2 className="text-lg font-medium">{p.name}</h2>
            <p className="text-sm text-gray-500">Ajouté le {new Date(p.created_at).toLocaleDateString()}</p>
          </li>
        ))}
        {products?.length === 0 && (
          <li className="text-gray-500">Aucun produit pour l’instant.</li>
        )}
      </ul>
    </section>
  );
}
