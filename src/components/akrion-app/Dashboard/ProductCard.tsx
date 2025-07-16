'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type Props = {
  id: string;
  name: string;
  createdAt: string;
  onEdit: () => void;
};

export function ProductCard({ id, name, createdAt, onEdit }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Produit supprimé');
      router.refresh();
    } else {
      toast.error('Erreur lors de la suppression');
    }
  }

  return (
    <Card className="group relative transition-shadow hover:shadow-lg">
      {/* Actions flottantes (apparaissent au hover) */}
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 -translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0">
        <Button
          size="icon"
          variant="ghost"
          aria-label="Modifier"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-4 w-4 text-gray-500 hover:text-indigo-600" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Supprimer"
              onClick={e => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce produit&nbsp;?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible ; le produit sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="truncate">{name}</CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-gray-500">
        créé le {createdAt}
      </CardContent>
    </Card>
  );
}
