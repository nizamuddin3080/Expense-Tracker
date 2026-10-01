import { Metadata } from 'next';
import { getIncomeVsExpenseReport, getExpenseByCategoryReport, getSpendingTrendReport } from '@/server/queries/report.queries';
import { IncomeExpenseChart } from '@/components/reports/income-expense-chart';
import { CategoryChart } from '@/components/reports/category-chart';
import { TrendChart } from '@/components/reports/trend-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { startOfMonth, endOfMonth } from 'date-fns';

export const metadata: Metadata = {
  title: 'Reports & Analytics | FinTrack',
  description: 'View your financial reports and analytics',
};

export default async function ReportsPage() {
  const currentDate = new Date();
  
  const [incomeVsExpense, categoryExpense, spendingTrend] = await Promise.all([
    getIncomeVsExpenseReport(6),
    getExpenseByCategoryReport(startOfMonth(currentDate), endOfMonth(currentDate)),
    getSpendingTrendReport(30),
  ]);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Income vs Expense</CardTitle>
            <CardDescription>
              Your cash flow over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <IncomeExpenseChart data={incomeVsExpense} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
            <CardDescription>
              Where your money went this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={categoryExpense} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending Trend</CardTitle>
            <CardDescription>
              Daily expenses over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TrendChart data={spendingTrend} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
