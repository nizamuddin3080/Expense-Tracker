'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTransactionAction } from '@/server/actions/transaction.actions';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

interface DeleteTransactionButtonProps {
  id: string;
}

export function DeleteTransactionButton({ id }: DeleteTransactionButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteTransactionAction(id);
      if (result.success) {
        toast.success('Transaction deleted');
        router.push('/transactions');
      } else {
        toast.error(result.error || 'Failed to delete transaction');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      <Trash className="w-4 h-4 mr-2" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
