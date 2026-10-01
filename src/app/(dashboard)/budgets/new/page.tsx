import { getCategories } from '@/server/queries/category.queries';
import { BudgetForm } from '@/components/budgets/budget-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'New Budget - FinTrack',
};

export default async function NewBudgetPage() {
  const categories = await getCategories();
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Budget</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set a spending limit for a specific category.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Details</CardTitle>
          <CardDescription>
            Budgets help you track how much you spend in specific categories each month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BudgetForm categories={expenseCategories} />
        </CardContent>
      </Card>
    </div>
  );
}
