'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { createBudgetSchema, CreateBudgetInput } from '@/lib/validators';
import { createBudgetAction } from '@/server/actions/budget.actions';
import { CategoryWithSubcategories } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BudgetFormProps {
  categories: CategoryWithSubcategories[];
}

export function BudgetForm({ categories }: BudgetFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const now = new Date();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBudgetInput>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      categoryId: '',
      amount: '',
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
  });

  const selectedCategoryId = watch('categoryId');

  async function onSubmit(data: CreateBudgetInput) {
    setIsPending(true);
    try {
      const result = await createBudgetAction(data);

      if (result.success) {
        toast.success('Budget created successfully');
        router.push('/budgets');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to create budget');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          value={selectedCategoryId}
          onChange={(e) => setValue('categoryId', e.target.value, { shouldValidate: true })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Budget Amount (৳)</Label>
        <Input
          id="amount"
          placeholder="0.00"
          {...register('amount')}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* Hidden fields for month/year - default to current */}
      <input type="hidden" {...register('month', { valueAsNumber: true })} />
      <input type="hidden" {...register('year', { valueAsNumber: true })} />

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Budget'
          )}
        </Button>
      </div>
    </form>
  );
}
