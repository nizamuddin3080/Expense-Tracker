'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema, CreateTransactionInput } from '@/lib/validators';
import { createTransactionAction } from '@/server/actions/transaction.actions';
import { AccountWithBalance, CategoryWithSubcategories, TransactionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface TransactionFormProps {
  accounts: AccountWithBalance[];
  categories: CategoryWithSubcategories[];
}

export function TransactionForm({ accounts, categories }: TransactionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: TransactionType.EXPENSE,
      amount: '',
      accountId: '',
      categoryId: '',
      toAccountId: '',
      date: new Date().toISOString().split('T')[0],
      merchant: '',
      note: '',
    },
  });

  const type = form.watch('type');
  
  const typeCategories = categories.filter(c => c.type === type);

  async function onSubmit(data: CreateTransactionInput) {
    setIsLoading(true);
    try {
      const result = await createTransactionAction(data);
      if (result.success) {
        toast.success('Transaction created successfully');
        router.push('/transactions');
      } else {
        toast.error(result.error || 'Failed to create transaction');
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors) {
                form.setError(field as keyof CreateTransactionInput, { message: errors[0] });
            }
          });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="type">Transaction Type</Label>
          <Select 
            onValueChange={(val) => {
              form.setValue('type', val as TransactionType);
              form.setValue('categoryId', '');
              form.setValue('toAccountId', '');
            }} 
            defaultValue={form.getValues('type')}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="TRANSFER">Transfer</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input 
            id="amount" 
            type="number" 
            step="0.01"
            placeholder="0.00"
            {...form.register('amount')} 
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountId">{type === 'TRANSFER' ? 'From Account' : 'Account'}</Label>
          <Select 
            onValueChange={(val) => form.setValue('accountId', val as string)} 
            value={form.watch('accountId') || ''}
          >
            <SelectTrigger id="accountId">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map(acc => (
                <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.accountId && (
            <p className="text-sm text-red-500">{form.formState.errors.accountId.message}</p>
          )}
        </div>

        {type === 'TRANSFER' && (
          <div className="space-y-2">
            <Label htmlFor="toAccountId">To Account</Label>
            <Select 
              onValueChange={(val) => form.setValue('toAccountId', val as string)} 
              value={form.watch('toAccountId') || ''}
            >
              <SelectTrigger id="toAccountId">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.filter(acc => acc.id !== form.watch('accountId')).map(acc => (
                  <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.toAccountId && (
              <p className="text-sm text-red-500">{form.formState.errors.toAccountId.message}</p>
            )}
          </div>
        )}

        {type !== 'TRANSFER' && (
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select 
              onValueChange={(val) => form.setValue('categoryId', val as string)} 
              value={form.watch('categoryId') || ''}
            >
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {typeCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.categoryId && (
              <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            {...form.register('date')} 
          />
          {form.formState.errors.date && (
            <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="merchant">Merchant (Optional)</Label>
          <Input 
            id="merchant" 
            placeholder="e.g. Walmart, Starbucks"
            {...form.register('merchant')} 
          />
          {form.formState.errors.merchant && (
            <p className="text-sm text-red-500">{form.formState.errors.merchant.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="note">Note (Optional)</Label>
          <Input 
            id="note" 
            placeholder="Add a note"
            {...form.register('note')} 
          />
          {form.formState.errors.note && (
            <p className="text-sm text-red-500">{form.formState.errors.note.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Transaction'}
        </Button>
      </div>
    </form>
  );
}
