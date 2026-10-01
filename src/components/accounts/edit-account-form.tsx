'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateAccountSchema, UpdateAccountInput } from '@/lib/validators';
import { updateAccountAction, deleteAccountAction } from '@/server/actions/account.actions';
import { AccountWithBalance } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface EditAccountFormProps {
  account: AccountWithBalance;
}

export function EditAccountForm({ account }: EditAccountFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UpdateAccountInput>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      id: account.id,
      name: account.name,
      type: account.type as any,
      openingBalance: account.openingBalance.toString(),
      currency: account.currency,
      isActive: account.isActive,
    },
  });

  async function onSubmit(data: UpdateAccountInput) {
    setIsLoading(true);
    try {
      const result = await updateAccountAction(data);
      if (result.success) {
        toast.success('Account updated successfully');
        router.push(`/accounts/${account.id}`);
      } else {
        toast.error(result.error || 'Failed to update account');
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors) {
                form.setError(field as keyof UpdateAccountInput, { message: errors[0] });
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

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete or deactivate this account?')) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteAccountAction(account.id);
      if (result.success) {
        toast.success('Account deleted/deactivated successfully');
        router.push('/accounts');
      } else {
        toast.error(result.error || 'Failed to delete account');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Account Name</Label>
          <Input 
            id="name" 
            placeholder="e.g. Main Checking"
            {...form.register('name')} 
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Account Type</Label>
          <Select 
            onValueChange={(val) => form.setValue('type', val as any)} 
            defaultValue={form.getValues('type')}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="BANK">Bank Account</SelectItem>
              <SelectItem value="MOBILE_BANKING">Mobile Banking</SelectItem>
              <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
              <SelectItem value="DIGITAL_WALLET">Digital Wallet</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="openingBalance">Opening Balance</Label>
          <Input 
            id="openingBalance" 
            type="number" 
            step="0.01"
            placeholder="0.00"
            {...form.register('openingBalance')} 
          />
          {form.formState.errors.openingBalance && (
            <p className="text-sm text-red-500">{form.formState.errors.openingBalance.message}</p>
          )}
        </div>
        
        <div className="space-y-2 flex flex-col justify-end">
          <label className="flex items-center space-x-2 cursor-pointer p-2 border rounded-md">
            <input 
              type="checkbox"
              className="rounded text-primary focus:ring-primary h-4 w-4"
              {...form.register('isActive')}
            />
            <span className="text-sm font-medium">Account is Active</span>
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isLoading}>
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </Button>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading || isDeleting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isDeleting}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
