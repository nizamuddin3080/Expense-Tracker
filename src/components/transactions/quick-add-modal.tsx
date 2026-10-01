'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionForm } from './transaction-form';
import { getTransactionFormData } from '@/server/actions/transaction.actions';
import { Plus } from 'lucide-react';

export function QuickAddModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<{ accounts: any[], categories: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !data) {
      setIsLoading(true);
      getTransactionFormData().then((result) => {
        if (result.success && result.data) {
          setData(result.data);
        }
        setIsLoading(false);
      });
    }
  }, [isOpen, data]);

  return (
    <>
      <div 
        className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <Plus className="w-6 h-6" />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh] md:h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Add Transaction</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : data ? (
            <TransactionForm 
              accounts={data.accounts} 
              categories={data.categories} 
              onSuccess={() => setIsOpen(false)}
            />
          ) : (
            <div className="py-8 text-center text-destructive">Failed to load form data</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
