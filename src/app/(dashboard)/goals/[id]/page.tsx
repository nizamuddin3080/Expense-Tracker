import { getGoal } from '@/server/queries/goal.queries';
import { notFound } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AddFundsForm from '@/components/goals/add-funds-form';
import { Target, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Decimal from 'decimal.js';

export default async function GoalDetailsPage({ params }: { params: { id: string } }) {
  const goal = await getGoal(params.id);

  if (!goal) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary/10 rounded-full">
          {goal.icon ? <span className="text-2xl">{goal.icon}</span> : <Target className="h-6 w-6 text-primary" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{goal.name}</h1>
          {goal.targetDate && (
            <p className="text-muted-foreground flex items-center mt-1 text-sm">
              <Calendar className="mr-1 h-4 w-4" />
              Target: {formatDate(goal.targetDate)}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Target</p>
                    <p className="text-xl font-semibold">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{goal.percentage.toFixed(1)}%</span>
                    {goal.isCompleted && <span className="text-green-600 font-medium">Goal Reached!</span>}
                  </div>
                  <Progress value={Math.min(goal.percentage, 100)} className="h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              {goal.transactions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No transactions yet. Add funds to get started!
                </div>
              ) : (
                <div className="space-y-4">
                  {goal.transactions.map((tx) => {
                    const isDeposit = new Decimal(tx.amount).isPositive();
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${isDeposit ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {isDeposit ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{isDeposit ? 'Deposit' : 'Withdrawal'}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(tx.date)} {tx.note && `• ${tx.note}`}</p>
                          </div>
                        </div>
                        <p className={`font-medium ${isDeposit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {isDeposit ? '+' : ''}{formatCurrency(tx.amount)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <AddFundsForm goalId={goal.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
