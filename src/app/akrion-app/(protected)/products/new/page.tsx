// app/akrion-app/products/new/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function NewProduct() {
  async function create(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/akrion-app/login');

    await supabase.from('products').insert({
      owner_id: user.id,
      name:        formData.get('name'),
      description: formData.get('description'),
    });

    redirect('/akrion-app/dashboard');
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4 pt-[10vh]">
      <form action={create} className="w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">Ajouter un produit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input name="name" placeholder="Nom du produit" required />
            <Textarea name="description" placeholder="Description (optionnel)" rows={4} />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Créer</Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}
