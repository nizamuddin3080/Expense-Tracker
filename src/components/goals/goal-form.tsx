'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGoalSchema, CreateGoalInput } from '@/lib/validators';
import { createGoalAction } from '@/server/actions/goal.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GoalForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGoalInput>({
    resolver: zodResolver(createGoalSchema),
  });

  async function onSubmit(data: CreateGoalInput) {
    setIsPending(true);
    const result = await createGoalAction(data);
    setIsPending(false);

    if (result.success) {
      toast.success('Goal created successfully');
      router.push('/goals');
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Goal Name</Label>
        <Input placeholder="E.g., New Car, Vacation" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Target Amount</Label>
        <Input placeholder="0.00" {...register('targetAmount')} />
        {errors.targetAmount && <p className="text-sm text-destructive">{errors.targetAmount.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Target Date (Optional)</Label>
        <Input type="date" {...register('targetDate')} />
        {errors.targetDate && <p className="text-sm text-destructive">{errors.targetDate.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Icon (Emoji)</Label>
          <Input placeholder="🚗" {...register('icon')} />
        </div>
        <div className="space-y-2">
          <Label>Color (Hex)</Label>
          <Input placeholder="#3b82f6" {...register('color')} />
          {errors.color && <p className="text-sm text-destructive">{errors.color.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : 'Create Goal'}
      </Button>
    </form>
  );
}
