import { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/server/queries/category.queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, HelpCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CategoryWithSubcategories } from '@/types';

export const metadata: Metadata = {
  title: 'Categories | FinTrack',
  description: 'Manage your expense and income categories.',
};

function CategoryIcon({ name, color }: { name?: string | null; color?: string | null }) {
  if (!name) return <HelpCircle className="w-5 h-5 text-muted-foreground" />;
  const IconComponent = (LucideIcons as any)[name] || HelpCircle;
  return <IconComponent className="w-5 h-5" style={{ color: color || 'currentColor' }} />;
}

function CategoryList({ title, categories }: { title: string; categories: CategoryWithSubcategories[] }) {
  if (categories.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center text-muted-foreground">
            No categories found.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2 flex flex-row items-center space-y-0 gap-3 border-b bg-muted/20">
              <div className="p-2 bg-background rounded-md shadow-sm border">
                <CategoryIcon name={category.icon} color={category.color} />
              </div>
              <CardTitle className="text-base font-medium">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              {category.subcategories && category.subcategories.length > 0 ? (
                <ul className="space-y-1">
                  {category.subcategories.map((sub) => (
                    <li key={sub.id} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      {sub.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No subcategories</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');
  const incomeCategories = categories.filter((c) => c.type === 'INCOME');

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage your expense and income categories.
          </p>
        </div>
        <Link href="/categories/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <CategoryList title="Expense Categories" categories={expenseCategories} />
      <CategoryList title="Income Categories" categories={incomeCategories} />
    </div>
  );
}
