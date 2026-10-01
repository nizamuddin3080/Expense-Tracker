import { getAccounts } from '@/server/queries/account.queries';
import { getCategories } from '@/server/queries/category.queries';
import RecurringForm from '@/components/recurring/recurring-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function NewRecurringPage() {
  const accounts = await getAccounts();
  const categories = await getCategories();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add Recurring Transaction</h1>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <RecurringForm accounts={accounts} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
