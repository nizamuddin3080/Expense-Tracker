import { getDashboardSummary } from '@/server/queries/dashboard.queries';
import { formatCurrency, formatDate } from '@/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Wallet, TrendingUp, TrendingDown, Activity, PlusCircle, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { TRANSACTION_TYPE_COLORS } from '@/lib/constants';

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  if (!summary.hasAccounts) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Wallet className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to FinTrack</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          You don&apos;t have any accounts yet. Create your first account to start tracking your finances.
        </p>
        <div className="flex gap-4">
          <Link href="/accounts" className={buttonVariants()}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link href="/transactions/new" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Transaction
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.monthlyIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.monthlyExpense)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Today: {formatCurrency(summary.todaySpending)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.netCashFlow)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Savings Rate: {summary.savingsRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Overview</CardTitle>
          <CardDescription>Income vs Expense for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <OverviewChart data={summary.monthlyTrend} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>This month&apos;s expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingChart 
              data={summary.spendingByCategory.map(c => ({
                name: c.categoryName,
                value: Number(c.amount)
              }))} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </div>
            <Link href="/transactions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {summary.recentTransactions.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-4">
                  No recent transactions
                </div>
              ) : (
                summary.recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center">
                    <div className="bg-muted p-2 rounded-full mr-4">
                      {tx.type === 'INCOME' ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : 
                       tx.type === 'EXPENSE' ? <TrendingDown className="h-4 w-4 text-rose-500" /> : 
                       <CreditCard className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {tx.merchant || tx.category?.name || 'Transfer'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tx.account.name} • {formatDate(tx.date)}
                      </p>
                    </div>
                    <div className={`font-medium ${TRANSACTION_TYPE_COLORS[tx.type as keyof typeof TRANSACTION_TYPE_COLORS]}`}>
                      {tx.type === 'EXPENSE' ? '-' : tx.type === 'INCOME' ? '+' : ''}
                      {formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
