'use client';

import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PlusCircle, Pencil } from 'lucide-react';
import { Product } from '@/types/akrion-app/product';  

/* ---------- Types ---------- */


type Props = {
  mode: 'create' | 'edit';
  product?: Product;
  children?: React.ReactNode;
  triggerClassName?: string;
  open?: boolean;
  setOpen?: (v: boolean) => void;
};

/* ---------- Component ---------- */
export function ProductDrawer({
  mode,
  product,
  children,
  triggerClassName,
  open,
  setOpen,
}: Props) {
  const router   = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit   = mode === 'edit';

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const endpoint = isEdit ? `/api/products/${product!.id}` : '/api/products';
    const method   = isEdit ? 'PATCH' : 'POST';
    const body     = isEdit ? JSON.stringify(Object.fromEntries(formData)) : formData;
    const headers  = isEdit ? { 'Content-Type': 'application/json' } : undefined;

    const res = await fetch(endpoint, { method, body, headers });
    setLoading(false);

    if (res.ok) {
      toast.success(isEdit ? 'Produit mis à jour' : 'Produit créé');
      setOpen?.(false);
      router.refresh();
    } else {
      toast.error('Erreur serveur');
    }
  }

  /* --- Trigger par défaut (si `children` non fourni) --- */
  const DefaultTrigger = (
    <Button
      className={`flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-white shadow hover:bg-indigo-700 ${triggerClassName}`}
    >
      {isEdit ? <Pencil className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
      {isEdit ? 'Modifier' : 'Ajouter un produit'}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children ?? DefaultTrigger}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full max-w-2xl overflow-y-auto rounded-l-2xl
                   bg-white/90 backdrop-blur-lg px-8 py-10 shadow-xl"
      >
        {/* Header accessible (obligatoire pour Radix) */}
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-900">
            {isEdit ? (
              <>
                <Pencil className="h-5 w-5 text-indigo-600" />
                Modifier le produit
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5 text-indigo-600" />
                Nouveau produit
              </>
            )}
          </SheetTitle>
          <p className="text-sm text-gray-500">
            {isEdit
              ? 'Mettez à jour les informations relatives à ce produit.'
              : 'Remplissez les détails pour créer un nouveau produit logiciel.'}
          </p>
        </SheetHeader>

        {/* Formulaire */}
        <form action={handleSubmit} className="space-y-5">
          <Input
            name="name"
            defaultValue={product?.name ?? ''}
            placeholder="Nom du produit"
            required
            className="rounded-xl text-base"
          />
          <Textarea
            name="description"
            defaultValue={product?.description ?? ''}
            placeholder="Description du produit"
            rows={3}
            className="rounded-xl text-base"
          />
          <Textarea
            name="intended_use"
            defaultValue={product?.intended_use ?? ''}
            placeholder="Usage prévu"
            rows={2}
            className="rounded-xl text-base"
          />
          <Input
            name="intended_user"
            defaultValue={product?.intended_user ?? ''}
            placeholder="Utilisateur visé"
            className="rounded-xl text-base"
          />
          <Input
            name="intended_environment"
            defaultValue={product?.intended_environment ?? ''}
            placeholder="Environnement d’utilisation"
            className="rounded-xl text-base"
          />
          <Input
            name="patient_population"
            defaultValue={product?.patient_population ?? ''}
            placeholder="Population cible"
            className="rounded-xl text-base"
          />
          <Textarea
            name="operation_principle"
            defaultValue={product?.operation_principle ?? ''}
            placeholder="Principe de fonctionnement"
            rows={2}
            className="rounded-xl text-base"
          />

          <Button
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-base text-white shadow
                       hover:bg-indigo-700 transition"
          >
            {loading
              ? 'En cours…'
              : isEdit
              ? 'Enregistrer les modifications'
              : 'Créer le produit'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
