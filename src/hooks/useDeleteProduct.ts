import { useState } from 'react';

export function useDeleteProduct() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProduct = async (productId: string, productName: string) => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Recharger la page pour mettre à jour la liste
        window.location.reload();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Vous pouvez ajouter ici une notification toast d'erreur
      alert('❌ Erreur lors de la suppression du produit. Veuillez réessayer.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteProduct,
    isDeleting
  };
}