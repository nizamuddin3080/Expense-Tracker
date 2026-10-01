'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRecurringSchema, CreateRecurringInput } from '@/lib/validators';
import { createRecurringAction } from '@/server/actions/recurring.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AccountWithBalance } from '@/types';
import { Category } from '@prisma/client';

export default function RecurringForm({
  accounts,
  categories,
}: {
  accounts: AccountWithBalance[];
  categories: Category[];
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(createRecurringSchema) as any,
    defaultValues: {
      type: 'EXPENSE',
      interval: 1,
      frequency: 'MONTHLY',
    },
  });

  const type = watch('type');
  const filteredCategories = categories.filter((c) => c.type === type);

  async function onSubmit(data: CreateRecurringInput) {
    setIsPending(true);
    const result = await createRecurringAction(data);
    setIsPending(false);

    if (result.success) {
      toast.success('Recurring transaction created successfully');
      router.push('/recurring');
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select onValueChange={(val) => setValue('type', val as any)} defaultValue={type}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Amount</Label>
          <Input placeholder="0.00" {...register('amount')} />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account</Label>
          <Select onValueChange={(val) => setValue('accountId', val as string)}>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.accountId && <p className="text-sm text-destructive">{errors.accountId.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select onValueChange={(val) => setValue('categoryId', val as string)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Frequency</Label>
          <Select onValueChange={(val) => setValue('frequency', val as any)} defaultValue="MONTHLY">
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="QUARTERLY">Quarterly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.frequency && <p className="text-sm text-destructive">{errors.frequency.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" {...register('startDate')} />
          {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message as string}</p>}
        </div>
      </div>

      <div className="space-y-2">
          <Label>Merchant (Optional)</Label>
          <Input placeholder="E.g., Netflix, Salary" {...register('merchant')} />
          {errors.merchant && <p className="text-sm text-destructive">{errors.merchant.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>End Date (Optional)</Label>
        <Input type="date" {...register('endDate')} />
        {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Note (Optional)</Label>
        <Input placeholder="Additional details" {...register('note')} />
        {errors.note && <p className="text-sm text-destructive">{errors.note.message as string}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Recurring Transaction'}
      </Button>
    </form>
  );
}

