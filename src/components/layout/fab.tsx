'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Fab() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push('/transactions/new')}
      className="fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-lg lg:hidden flex items-center justify-center p-0"
      size="icon"
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">Add Transaction</span>
    </Button>
  );
}
