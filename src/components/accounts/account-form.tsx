'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { createAccountSchema, CreateAccountInput } from '@/lib/validators';
import { createAccountAction } from '@/server/actions/account.actions';
import { ACCOUNT_TYPE_LABELS, ACCOUNT_TYPE_ICONS } from '@/lib/constants';
import { AccountType } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as LucideIcons from 'lucide-react';

export function AccountForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateAccountInput>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      type: 'BANK',
      openingBalance: '',
      currency: 'BDT',
    },
  });

  const onSubmit = async (data: CreateAccountInput) => {
    setIsPending(true);
    try {
      const result = await createAccountAction(data);
      if (result.success) {
        toast.success('Account created successfully');
        router.push('/accounts');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create account');
        if (result.fieldErrors) {
          // If we had form.setError we could use it here, but toast is okay for now
          Object.values(result.fieldErrors).forEach((errors) => {
            errors.forEach((err) => toast.error(err));
          });
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Account Name</Label>
          <Input
            id="name"
            placeholder="e.g. City Bank, bKash, Cash Wallet"
            {...register('name')}
            disabled={isPending}
          />
          {errors.name && (
            <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Account Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => {
                    const iconName = ACCOUNT_TYPE_ICONS[value as AccountType];
                    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Wallet;
                    return (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm font-medium text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="openingBalance">Opening Balance (BDT)</Label>
          <Input
            id="openingBalance"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('openingBalance')}
            disabled={isPending}
          />
          {errors.openingBalance && (
            <p className="text-sm font-medium text-destructive">
              {errors.openingBalance.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
}
