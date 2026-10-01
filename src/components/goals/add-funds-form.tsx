'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { goalTransactionSchema, GoalTransactionInput } from '@/lib/validators';
import { addGoalTransactionAction } from '@/server/actions/goal.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState } from 'react';
import { formatDateForInput } from '@/lib/format';

export default function AddFundsForm({ goalId }: { goalId: string }) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalTransactionInput>({
    resolver: zodResolver(goalTransactionSchema),
    defaultValues: {
      goalId,
      date: formatDateForInput(new Date()),
    },
  });

  async function onSubmit(data: GoalTransactionInput) {
    setIsPending(true);
    const result = await addGoalTransactionAction(data);
    setIsPending(false);

    if (result.success) {
      toast.success('Funds added successfully');
      reset({ goalId, date: formatDateForInput(new Date()), amount: '', note: '' });
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Amount (Positive to add, Negative to withdraw)</Label>
        <Input placeholder="0.00" {...register('amount')} />
        {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Input type="date" {...register('date')} />
        {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Note (Optional)</Label>
        <Input placeholder="e.g., Monthly deposit" {...register('note')} />
        {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Add / Withdraw Funds'}
      </Button>
    </form>
  );
}
