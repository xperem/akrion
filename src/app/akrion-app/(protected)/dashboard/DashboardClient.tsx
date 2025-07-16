// src/app/akrion-app/(protected)/dashboard/DashboardClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ProductDrawer } from '@/components/akrion-app/Dashboard/ProductDrawer';
import { DeleteModal } from '@/components/akrion-app/Dashboard/DeleteModal';
import { useToast } from '@/components/akrion-app/Dashboard/Toast';
import { DashboardHeader } from '@/components/akrion-app/Dashboard/DashboardHeader';
import { ProductGridItem } from '@/components/akrion-app/ProductGridItem';
import { EmptyState } from '@/components/akrion-app/Dashboard/EmptyState';
import { Product } from '@/types/akrion-app/product';

type Props = { products: (Product & { id: string })[] };

export default function DashboardClient({ products }: Props) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: '',
    productName: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  const hasProducts = products.length > 0;

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/products/${deleteModal.productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        showToast(`"${deleteModal.productName}" a été supprimé avec succès.`, 'success');
        setDeleteModal({ isOpen: false, productId: '', productName: '' });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showToast('Erreur lors de la suppression du produit. Veuillez réessayer.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (productId: string, productName: string) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, productId: '', productName: '' });
  };

  const handleViewTools = (productId: string) => {
    router.push(`/akrion-app/tools?product=${productId}`);
  };

  const handleEditProduct = (product: Product) => {
    setEditing(product);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="min-h-screen" data-full-height>
        <DashboardHeader products={products} hasProducts={hasProducts} />

        <main className="px-6 py-6">
          {hasProducts ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductGridItem
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={openDeleteModal}
                  onViewTools={handleViewTools}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </main>

        {/* Drawer d'édition */}
        {editing && (
          <ProductDrawer
            mode="edit"
            product={editing}
            open={drawerOpen}
            setOpen={(v) => {
              if (!v) setEditing(null);
              setDrawerOpen(v);
            }}
            triggerClassName="hidden"
          />
        )}
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProduct}
        productName={deleteModal.productName}
        isLoading={isDeleting}
      />

      <ToastContainer />
    </>
  );
}