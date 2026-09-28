import { getAccounts } from '@/server/queries/account.queries';
import { getCategories } from '@/server/queries/category.queries';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function NewTransactionPage() {
  const [accounts, categories] = await Promise.all([
    getAccounts(),
    getCategories(),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add Transaction</h1>
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm accounts={accounts} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
