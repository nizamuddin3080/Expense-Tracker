import { Metadata } from 'next';
import { CategoryForm } from '@/components/categories/category-form';

export const metadata: Metadata = {
  title: 'New Category | FinTrack',
  description: 'Create a new category for your transactions.',
};

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
        <p className="text-muted-foreground mt-2">
          Add a custom category to better organize your finances.
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
