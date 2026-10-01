import { getRecurringTransactions } from '@/server/queries/recurring.queries';
import { formatCurrency, formatDate } from '@/lib/format';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

import { toggleRecurringAction } from '@/server/actions/recurring.actions';
import { ArrowDownIcon, ArrowUpIcon, CalendarClock, PlusIcon } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function RecurringPage() {
  const recurringTxs = await getRecurringTransactions();

  async function handleToggle(id: string, currentState: boolean) {
    'use server';
    await toggleRecurringAction(id, !currentState);
    revalidatePath('/recurring');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Recurring Transactions</h1>
        <Link href="/recurring/new" className={buttonVariants({ variant: 'default' })}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Recurring
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recurringTxs.map((rt) => (
          <Card key={rt.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${rt.type === 'INCOME' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {rt.type === 'INCOME' ? <ArrowDownIcon className="h-5 w-5" /> : <ArrowUpIcon className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold leading-none mb-2">
                      {rt.merchant || rt.category?.name || 'Recurring Transaction'}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {rt.frequency.toLowerCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${rt.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {rt.type === 'INCOME' ? '+' : '-'}{formatCurrency(rt.amount)}
                  </p>
                  <Badge variant={rt.isActive ? 'default' : 'secondary'} className="mt-1">
                    {rt.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Next: {formatDate(rt.nextDueDate)}
                </div>
                <form action={async () => {
                  'use server';
                  await handleToggle(rt.id, rt.isActive);
                }}>
                  <button type="submit" className="text-sm font-medium hover:underline text-primary">
                    Toggle Status
                  </button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}

        {recurringTxs.length === 0 && (
          <div className="col-span-full py-12 text-center border rounded-lg bg-muted/20">
            <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No recurring transactions</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Automate your regular income and expenses.
            </p>
            <Link href="/recurring/new" className={buttonVariants({ variant: 'outline' })}>
              Add your first recurring transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
