'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCategorySchema, CreateCategoryInput } from '@/lib/validators';
import { createCategoryAction } from '@/server/actions/category.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner'; // assuming sonner or similar is used, else standard alert or we just handle it.

export function CategoryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      icon: '',
      color: '',
    },
  });

  const typeValue = watch('type');

  const onSubmit = async (data: CreateCategoryInput) => {
    setIsLoading(true);
    try {
      const result = await createCategoryAction(data);
      if (result.success) {
        toast.success?.('Category created successfully') || alert('Category created successfully');
        router.push('/categories');
      } else {
        toast.error?.(result.error) || alert(result.error);
      }
    } catch (error) {
      toast.error?.('An error occurred') || alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
        <CardDescription>Add a new expense or income category.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g. Groceries"
              {...register('name')}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={typeValue}
              onValueChange={(val: 'EXPENSE' | 'INCOME') => setValue('type', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Lucide icon name)</Label>
            <Input
              id="icon"
              placeholder="e.g. Coffee, Car, Home"
              {...register('icon')}
            />
            {errors.icon && <p className="text-sm text-red-500">{errors.icon.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color (Hex code)</Label>
            <Input
              id="color"
              placeholder="e.g. #ff0000"
              {...register('color')}
            />
            {errors.color && <p className="text-sm text-red-500">{errors.color.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Category'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
