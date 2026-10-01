import { getBudgets } from '@/server/queries/budget.queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/format';
import { PlusCircle } from 'lucide-react';
import { CopyBudgetsButton } from '@/components/budgets/copy-budgets-button';

export const metadata = {
  title: 'Budgets - FinTrack',
};

export default async function BudgetsPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string };
}) {
  const now = new Date();
  const month = searchParams.month ? parseInt(searchParams.month, 10) : now.getMonth() + 1;
  const year = searchParams.year ? parseInt(searchParams.year, 10) : now.getFullYear();

  const budgets = await getBudgets(month, year);
  
  const displayDate = new Date(year, month - 1, 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {format(displayDate, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyBudgetsButton month={month} year={year} />
          <Link href="/budgets/new" className={buttonVariants()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Budget
          </Link>
        </div>
      </div>

      {budgets.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-semibold">No budgets set</h3>
            <p className="text-muted-foreground text-sm mt-2 mb-4">
              Set up a budget to keep your spending in check.
            </p>
            <Link href="/budgets/new" className={buttonVariants({ variant: "outline" })}>Create your first budget</Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            let progressColor = 'bg-green-500';
            if (budget.percentage >= 100) {
              progressColor = 'bg-destructive';
            } else if (budget.percentage >= 80) {
              progressColor = 'bg-amber-500';
            }

            return (
              <Card key={budget.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {budget.categoryIcon && <span>{budget.categoryIcon}</span>}
                    {budget.categoryName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(Number(budget.spent))} / {formatCurrency(Number(budget.amount))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {budget.percentage >= 100 
                      ? 'Over budget'
                      : `${formatCurrency(Number(budget.remaining))} remaining`}
                  </p>
                  
                  <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${progressColor} transition-all duration-300`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-end text-xs text-muted-foreground">
                    {budget.percentage}%
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
