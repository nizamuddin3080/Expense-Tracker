'use client';

import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { copyBudgetsFromPreviousMonth } from '@/server/actions/budget.actions';

export function CopyBudgetsButton({ month, year }: { month: number; year: number }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    try {
      setIsLoading(true);
      const res = await copyBudgetsFromPreviousMonth(month, year);
      
      if (res.success) {
        if (res.data === 0) {
          toast.info('No new budgets were copied (they might already exist).');
        } else {
          toast.success(`Copied ${res.data} budgets from the previous month.`);
        }
      } else {
        toast.error(res.error || 'Failed to copy budgets');
      }
    } catch (error) {
      toast.error('An error occurred while copying budgets');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleCopy} disabled={isLoading}>
      <Copy className="mr-2 h-4 w-4" />
      {isLoading ? 'Copying...' : 'Copy Previous Month'}
    </Button>
  );
}
