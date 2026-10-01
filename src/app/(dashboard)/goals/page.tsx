import { getGoals } from '@/server/queries/goal.queries';
import { formatCurrency, formatDate } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { PlusIcon, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default async function GoalsPage() {
  const goals = await getGoals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
        <Link href="/goals/new" className={buttonVariants({ variant: 'default' })}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Goal
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Link href={`/goals/${goal.id}`} key={goal.id}>
            <Card className="hover:border-primary/50 transition-colors h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {goal.icon ? <span>{goal.icon}</span> : <Target className="h-5 w-5 text-muted-foreground" />}
                    {goal.name}
                  </CardTitle>
                  {goal.isCompleted && (
                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                      Completed
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(goal.percentage, 100)} className="h-2" />
                  <div className="flex justify-between text-sm pt-2">
                    <span className="font-semibold">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">of {formatCurrency(goal.targetAmount)}</span>
                  </div>
                  
                  {goal.targetDate && (
                    <div className="text-xs text-muted-foreground pt-2 flex items-center">
                      Target: {formatDate(goal.targetDate)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {goals.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg bg-muted/20">
            <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No savings goals</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Set goals to track your progress towards big purchases or savings targets.
            </p>
            <Link href="/goals/new" className={buttonVariants({ variant: 'outline' })}>
              Create your first goal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
